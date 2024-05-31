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
import {
    getJSONRPCErrorCode,
    JSONRPC,
    stringifyData
} from '@vechain/sdk-errors';
import importConfig from '../config.json';
import { type Config, type RequestBody } from './types';

// Import the version from the package.json
import packageJson from '../package.json';
import {
    VET_DERIVATION_PATH,
    addressUtils,
    secp256k1
} from '@vechain/sdk-core';

const version: string = packageJson.version;

// Create the program to parse the command line arguments and options
const program = new Command();
program
    .version(version)
    .description('VeChain RPC Proxy')
    .addOption(
        new Option('-n, --node <url>', 'Node URL of the blockchain')
            .env('NODE_URL')
            .default('https://mainnet.vechain.org/')
    )
    .addOption(
        new Option('-p, --port <port>', 'Port to listen')
            .env('PORT')
            .default('8545')
    )
    .addOption(new Option('-v, --verbose', 'Enables more detailed logging'))
    .parse(process.argv);
const options = program.opts();

if (options.node != null) {
    console.log(
        'Please provide all required options. Use --help for more information'
    );
    process.exit(1);
}

/**
 * Start the proxy function.
 * @note
 * * This is a simple proxy server that converts and forwards RPC requests to the VeChain network.
 * * Don't use this in production, it's just for testing purposes.
 */
function startProxy(): void {
    const config: Config = importConfig as Config;
    console.log('[rpc-proxy]: Starting VeChain RPC Proxy');

    const thorClient = new ThorClient(new HttpClient(options.node as string));
    // Create the wallet
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

    app.listen(options.port, () => {
        console.log(`[rpc-proxy]: Proxy is running on port ${options.port}`);
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
                VeChainSDKLogger('log').log({
                    title: `Sending request - ${requestBody.method}`,
                    messages: [`response: ${stringifyData(result)}`]
                });
            } catch (e) {
                res.json({
                    jsonrpc: '2.0',
                    error: e,
                    id: requestBody.id
                });

                // Log the error
                VeChainSDKLogger('error').log({
                    errorCode: JSONRPC.INTERNAL_ERROR,
                    errorMessage: `Error sending request - ${requestBody.method}`,
                    errorData: {
                        code: getJSONRPCErrorCode(JSONRPC.INVALID_REQUEST),
                        message: `Error on request - ${requestBody.method}`
                    },
                    innerError: e
                });
            }
        })();
    }
}

startProxy();
