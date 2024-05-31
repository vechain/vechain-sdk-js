import { Command, Option } from 'commander';
import { HttpClient, ThorClient, VeChainProvider } from '@vechain/sdk-network';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { type RequestBody } from './types';
import { VeChainSDKLogger } from '@vechain/sdk-logging';
import {
    getJSONRPCErrorCode,
    JSONRPC,
    stringifyData
} from '@vechain/sdk-errors';

// Import the version from the package.json
import packageJson from '../package.json';

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
 * Simple function to log an error.
 *
 * @param requestBody - The request body of error request
 * @param e - The error object
 */
function logError(requestBody: RequestBody, e: unknown): void {
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

/**
 * Simple function to log a request.
 *
 * @param requestBody - The request body of the request
 * @param result - The result of the request
 */
function logRequest(requestBody: RequestBody, result: unknown): void {
    VeChainSDKLogger('log').log({
        title: `Sending request - ${requestBody.method}`,
        messages: [`response: ${stringifyData(result)}`]
    });
}

/**
 * Start the proxy function.
 * @note
 * * This is a simple proxy server that converts and forwards RPC requests to the VeChain network.
 * * Don't use this in production, it's just for testing purposes.
 */
function startProxy(): void {
    console.log('[rpc-proxy]: Starting VeChain RPC Proxy');

    const thorClient = new ThorClient(new HttpClient(options.node as string));
    const provider = new VeChainProvider(thorClient);

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
                logRequest(requestBody, result);
            } catch (e) {
                res.json({
                    jsonrpc: '2.0',
                    error: e,
                    id: requestBody.id
                });

                // Log the error
                logError(requestBody, e);
            }
        })();
    }
}

startProxy();
