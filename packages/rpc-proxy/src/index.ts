#! /usr/bin/env node

import { Address, HDKey, HexUInt, Secp256k1 } from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    ProviderInternalHDWallet,
    type ProviderInternalWallet,
    ThorClient,
    VeChainProvider
} from '@vechain/sdk-network';
import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import defaultProxyConfig from '../default-proxy-config.json';
import packageJson from '../package.json';
import { type Config, type RequestBody } from './types';
import {
    getArgsFromEnv,
    getOptionsFromCommandLine,
    parseAndGetFinalConfig
} from './utils';
import { VeChainSDKLogger } from '@vechain/sdk-logging';
import {
    JSONRPCInternalError,
    stringifyData,
    JSONRPCMethodNotImplemented,
    JSONRPCMethodNotFound,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';

/**
 * Start the proxy function.
 * @note
 * * This is a simple proxy server that converts and forwards RPC requests to the VeChain network.
 * * Don't use this in production, it's just for testing purposes.
 */
function startProxy(): void {
    // Init the default configuration
    const defaultConfiguration: Config = defaultProxyConfig as Config;

    // Chose what args to pass to the proxy.
    // If we use docker, we will convert docker env variables to command line arguments
    // Otherwise, we will use the command line arguments
    const runIntoDockerContainer =
        process.env.RUNNING_WITH_DOCKER !== undefined &&
        process.env.RUNNING_WITH_DOCKER === 'true';

    // Get the command line arguments options. This will be used to parse the command line arguments
    const options = getOptionsFromCommandLine(
        packageJson.version,
        runIntoDockerContainer ? getArgsFromEnv() : process.argv
    );

    // Parse the SEMANTIC of the arguments and throw an error if the options are not valid
    const config = parseAndGetFinalConfig(options, defaultConfiguration);

    // Log the RPC Proxy start
    console.log('[rpc-proxy]: Starting VeChain RPC Proxy');

    // Create all necessary objects to init Provider and Signer
    const thorClient = ThorClient.at(config.url);
    const wallet: ProviderInternalWallet = Array.isArray(config.accounts)
        ? new ProviderInternalBaseWallet(
              config.accounts.map((privateKey: string) => {
                  // Convert the private key to a buffer
                  const privateKeyBuffer = HexUInt.of(
                      privateKey.startsWith('0x')
                          ? privateKey.slice(2)
                          : privateKey
                  ).bytes;

                  // Derive the public key and address from the private key
                  return {
                      privateKey: privateKeyBuffer,
                      publicKey: Secp256k1.derivePublicKey(privateKeyBuffer),
                      address: Address.ofPrivateKey(privateKeyBuffer).toString()
                  };
              }),
              {
                  gasPayer: config.gasPayer
              }
          )
        : new ProviderInternalHDWallet(
              config.accounts.mnemonic.split(' '),
              config.accounts.count,
              config.accounts.initialIndex,
              HDKey.VET_DERIVATION_PATH,
              { gasPayer: config.gasPayer }
          );
    const provider = new VeChainProvider(
        thorClient,
        wallet,
        config.enableDelegation
    );

    // Start the express proxy server
    const app: Express = express();
    app.disable('x-powered-by');
    app.use(
        (cors as (options: cors.CorsOptions) => express.RequestHandler)({})
    );
    app.use(express.json());

    app.post('*', handleRequest);
    app.get('*', handleRequest);

    app.listen(config.port, () => {
        console.log(`[rpc-proxy]: Proxy is running on port ${config.port}`);
    }).on('error', (err: Error) => {
        console.error(`[rpc-proxy]: Error starting proxy ${err.message}`);
    });

    function handleRequest(req: Request, res: Response): void {
        void (async () => {
            // Request array
            const requests = Array.isArray(
                req.body as RequestBody | RequestBody[]
            )
                ? (req.body as RequestBody[])
                : [req.body as RequestBody];

            // Response array
            const responses: unknown[] = [];

            for (const requestBody of requests) {
                try {
                    // Get result
                    const result = await provider.request({
                        method: requestBody.method,
                        params: requestBody.params
                    });

                    // Push the result to the responses array
                    responses.push({
                        jsonrpc: '2.0',
                        result,
                        id: requestBody.id
                    });

                    // Log the request and the response
                    if (config.verbose === true) {
                        VeChainSDKLogger('log').log({
                            title: `Sending request - ${requestBody.method}`,
                            messages: [`response: ${stringifyData(result)}`]
                        });
                    }
                } catch (error) {
                    // Format the error according to JSON-RPC 2.0 spec
                    let errorObj = {
                        code: -32603, // Default internal error code
                        message: 'Internal error'
                    };

                    // Handle specific error types
                    if (error instanceof JSONRPCMethodNotImplemented) {
                        errorObj = {
                            code: -32004,
                            message: 'Method not supported'
                        };
                    } else if (error instanceof JSONRPCMethodNotFound) {
                        errorObj = {
                            code: -32601,
                            message: 'Method not found'
                        };
                    } else if (error instanceof JSONRPCInvalidParams) {
                        errorObj = {
                            code: -32602,
                            message: 'Invalid params'
                        };
                    }

                    // Push the properly formatted error to the responses array
                    responses.push({
                        jsonrpc: '2.0',
                        error: errorObj,
                        id: requestBody.id
                    });

                    // Log the error
                    VeChainSDKLogger('error').log(
                        new JSONRPCInternalError(
                            requestBody.method,
                            `Error on request - ${requestBody.method}`,
                            { requestBody },
                            error
                        )
                    );
                }
            }

            res.json(responses.length === 1 ? responses[0] : responses);
        })();
    }
}

startProxy();
