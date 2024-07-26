#! /usr/bin/env node

import { Command, Option } from 'commander';
import {
    HttpClient,
    ProviderInternalBaseWallet,
    ProviderInternalHDWallet,
    type ProviderInternalWallet,
    ThorClient,
    VeChainProvider
} from '@vechain/sdk-network';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { VeChainSDKLogger } from '@vechain/sdk-logging';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';
import importConfig from '../config.json';
import { type Config, type RequestBody } from './types';
import fs from 'fs';
import path from 'path';
import {
    addressUtils,
    secp256k1,
    VET_DERIVATION_PATH
} from '@vechain/sdk-core';
import packageJson from '../package.json';

// Function to read and parse the configuration file
function readConfigFile(filePath: string): Config {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Configuration file not found: ${absolutePath}`);
    }
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent) as Config;
}

const version: string = packageJson.version;

// Create the program to parse the command line arguments and options
const program = new Command();
program
    .version(version)
    .description('VeChain RPC Proxy')
    .addOption(new Option('-c, --config <file>', 'Path to configuration file'))
    .parse(process.argv);
const options = program.opts();

/**
 * Start the proxy function.
 * @note
 * * This is a simple proxy server that converts and forwards RPC requests to the VeChain network.
 * * Don't use this in production, it's just for testing purposes.
 */
function startProxy(): void {
    let config: Config = importConfig as Config;
    if (options.config != null) {
        config = readConfigFile(options.config as string);
    }

    console.log('[rpc-proxy]: Starting VeChain RPC Proxy');

    const thorClient = new ThorClient(new HttpClient(config.url));
    // Create the wallet
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
                      address: addressUtils.fromPrivateKey(privateKeyBuffer)
                  };
              }),
              {
                  delegator: config.delegator
              }
          )
        : new ProviderInternalHDWallet(
              config.accounts.mnemonic.split(' '),
              config.accounts.count,
              0,
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
        console.error(`[rpc-proxy]: Error starting proxy: ${err.message}`);
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
