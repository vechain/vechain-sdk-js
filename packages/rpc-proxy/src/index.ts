#! /usr/bin/env node

import defaultProxyConfig from '../default-proxy-config.json';
import packageJson from '../package.json';
import { type Config, type RequestBody } from './types';
import { getOptionsFromCommandLine, parseAndGetFinalConfig } from './utils';
import {
    ProviderInternalBaseWallet,
    ProviderInternalHDWallet,
    type ProviderInternalWallet,
    ThorClient,
    VeChainProvider
} from '@vechain/sdk-network';
import { Address, secp256k1, VET_DERIVATION_PATH } from '@vechain/sdk-core';
import { VeChainSDKLogger } from '@vechain/sdk-logging';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';

/**
 * Start the proxy function.
 * @note
 * * This is a simple proxy server that converts and forwards RPC requests to the VeChain network.
 * * Don't use this in production, it's just for testing purposes.
 */
function startProxy(): void {
    // Init the default configuration
    const defaultConfiguration: Config = defaultProxyConfig as Config;

    // Get the command line arguments options. This will be used to parse the command line arguments
    const options = getOptionsFromCommandLine(
        packageJson.version,
        process.argv
    );

    // Parse the SEMANTIC of the arguments and throw an error if the options are not valid
    const config = parseAndGetFinalConfig(options, defaultConfiguration);

    console.log(`[rpc-proxy]: Using configuration ${JSON.stringify(config)}`);

    // Log the RPC Proxy start
    console.log('[rpc-proxy]: Starting VeChain RPC Proxy');

    // Create all necessary objects to init Provider and Signer
    const thorClient = ThorClient.fromUrl(config.url);
    const wallet: ProviderInternalWallet = Array.isArray(config.accounts)
        ? new ProviderInternalBaseWallet(
              config.accounts.map((privateKey: string) => {
                  // Convert the private key to a buffer
                  const privateKeyBuffer = Buffer.from(
                      privateKey.startsWith('0x')
                          ? privateKey.slice(2)
                          : privateKey,
                      'hex'
                  );

                  // Derive the public key and address from the private key
                  return {
                      privateKey: privateKeyBuffer,
                      publicKey: Buffer.from(
                          secp256k1.derivePublicKey(privateKeyBuffer)
                      ),
                      address: Address.ofPrivateKey(privateKeyBuffer).toString()
                  };
              }),
              {
                  delegator: config.delegator
              }
          )
        : new ProviderInternalHDWallet(
              config.accounts.mnemonic.split(' '),
              config.accounts.count,
              config.accounts.initialIndex,
              VET_DERIVATION_PATH,
              { delegator: config.delegator }
          );
    const provider = new VeChainProvider(
        thorClient,
        wallet,
        config.enableDelegation
    );

    // Start the express proxy server
    const app: Express = express();
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
            const requestBody = req.body as RequestBody;
            try {
                // Get result
                const result = await provider.request(requestBody);

                res.json({
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
            } catch (e) {
                res.json({
                    jsonrpc: '2.0',
                    error: e,
                    id: requestBody.id
                });

                // Log the error
                VeChainSDKLogger('error').log(
                    new JSONRPCInternalError(
                        requestBody.method,
                        -32603,
                        `Error on request - ${requestBody.method}`,
                        { requestBody },
                        e
                    )
                );
            }
        })();
    }
}

startProxy();
