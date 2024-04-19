import {
    HttpClient,
    ProviderInternalHDWallet,
    ThorClient,
    VechainProvider
} from '@vechain/sdk-network';
import importConfig from '../config.json';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { type Config, type RequestBody } from './types';
import { VechainSDKLogger } from '@vechain/sdk-logging';
import {
    getJSONRPCErrorCode,
    JSONRPC,
    stringifyData
} from '@vechain/sdk-errors';
import { VET_DERIVATION_PATH } from '@vechain/sdk-core';

/**
 * Simple function to log an error.
 *
 * @param requestBody - The request body of error request
 * @param e - The error object
 */
function logError(requestBody: RequestBody, e: unknown): void {
    VechainSDKLogger('error').log({
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
    VechainSDKLogger('log').log({
        title: `Sending request - ${requestBody.method}`,
        messages: [`response: ${stringifyData(result)}`]
    });
}

/**
 * Start the proxy function.
 * @note
 * * This is a simple proxy server that converts and forwards RPC requests to the vechain network.
 * * Don't use this in production, it's just for testing purposes.
 */
function startProxy(): void {
    // Initialize the proxy server
    const config: Config = importConfig as Config;
    const port = config.port ?? 8545;
    console.log(`[rpc-proxy]: Starting proxy on port ${port}`);

    // Initialize the provider
    const thorClient = new ThorClient(new HttpClient(config.url));
    const wallet = new ProviderInternalHDWallet(
        config.accounts.mnemonic.split(' '),
        config.accounts.count,
        0,
        VET_DERIVATION_PATH,
        { delegator: config.delegator }
    );
    const provider = new VechainProvider(
        thorClient,
        wallet,
        config.enbaleDelegation
    );

    // Start the express proxy server
    const app: Express = express();
    app.use(
        (cors as (options: cors.CorsOptions) => express.RequestHandler)({})
    );
    app.use(express.json());

    app.post('*', (req: Request, res: Response) => {
        void (async () => {
            const requestBody = req.body as RequestBody;

            try {
                // Get result
                const result = await provider.request(requestBody);
                res.json({
                    jsonrpc: 2.0,
                    result,
                    id: requestBody.id
                });

                // Log the request and the response
                logRequest(requestBody, result);
            } catch (e) {
                res.json({
                    jsonrpc: 2.0,
                    error: e,
                    id: requestBody.id
                });

                // Log the error
                logError(requestBody, e);
            }
        })();
    });

    app.get('*', (req: Request, res: Response) => {
        void (async () => {
            const requestBody = req.body as RequestBody;
            try {
                // Get result
                const result = await provider.request(requestBody);

                res.json({
                    jsonrpc: 2.0,
                    result,
                    id: requestBody.id
                });

                // Log the request and the response
                logRequest(requestBody, result);
            } catch (e) {
                res.json({
                    jsonrpc: 2.0,
                    error: e,
                    id: requestBody.id
                });

                // Log the error
                logError(requestBody, e);
            }
        })();
    });

    app.listen(port, () => {
        console.log(`[rpc-proxy]: Proxy is running on port ${port}`);
    }).on('error', (err: Error) => {
        console.error(`[rpc-proxy]: Error starting proxy: ${err.message}`);
    });
}

startProxy();
