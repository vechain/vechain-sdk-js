import { HDWallet } from '@vechain/sdk-wallet';
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { VechainProvider } from '@vechain/sdk-provider';
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
    const wallet = new HDWallet(config.accounts.mnemonic.split(' '));
    const provider = new VechainProvider(thorClient, wallet);

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
                VechainSDKLogger('log').log({
                    title: `Sending request - ${requestBody.method}`,
                    messages: [`response: ${stringifyData(result)}`]
                });
            } catch (e) {
                res.json({
                    jsonrpc: 2.0,
                    error: e,
                    id: requestBody.id
                });

                // Log the error
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
                VechainSDKLogger('log').log({
                    title: `Sending request - ${requestBody.method}`,
                    messages: [`response: ${stringifyData(result)}`]
                });
            } catch (e) {
                res.json({
                    jsonrpc: 2.0,
                    error: e,
                    id: requestBody.id
                });

                // Log the error
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
        })();
    });

    app.listen(port, () => {
        console.log(`[rpc-proxy]: Proxy is running on port ${port}`);
    }).on('error', (err: Error) => {
        console.error(`[rpc-proxy]: Error starting proxy: ${err.message}`);
    });
}

startProxy();
