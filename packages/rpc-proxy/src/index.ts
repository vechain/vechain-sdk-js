import { HDWallet } from '@vechain/vechain-sdk-wallet';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { VechainProvider } from '@vechain/vechain-sdk-provider';
import importConfig from '../config.json';
import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { type RequestBody, type Config } from './types';

function startProxy(): void {
    const config: Config = importConfig as Config;
    const port = config.port;
    console.log(`[proxy]: Starting proxy at http://localhost:${port}`);

    const soloNetwork = new HttpClient(config.url);
    const thorClient = new ThorClient(soloNetwork);
    const wallet = new HDWallet(config.accounts.mnemonic.split(' '));
    const provider = new VechainProvider(thorClient, wallet);

    const app: Express = express();
    app.use(
        (cors as (options: cors.CorsOptions) => express.RequestHandler)({})
    );
    app.use(express.json());

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.post('*', async (req: Request, res: Response) => {
        const requestBody = req.body as RequestBody;
        try {
            res.json({
                jsonrpc: 2.0,
                result: await provider.request(requestBody),
                id: requestBody.id
            });
        } catch (e) {
            res.json({
                jsonrpc: 2.0,
                error: e,
                id: requestBody.id
            });
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.get('*', async (req: Request, res: Response) => {
        const requestBody = req.body as RequestBody;
        try {
            res.json({
                jsonrpc: 2.0,
                result: await provider.request(requestBody),
                id: requestBody.id
            });
        } catch (e) {
            res.json({
                jsonrpc: 2.0,
                error: e,
                id: requestBody.id
            });
        }
    });

    app.listen(port, () => {
        console.log(`[proxy]: Proxy is running at http://localhost:${port}`);
    }).on('error', (err: Error) => {
        console.error(`[proxy]: Error starting proxy: ${err.message}`);
    });
}

startProxy();
