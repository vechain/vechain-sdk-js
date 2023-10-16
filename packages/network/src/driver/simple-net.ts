import { type Net } from './interfaces';
import Axios, { type AxiosInstance, type AxiosError } from 'axios';
import { SimpleWebSocketReader } from './simple-websocket-reader';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

/** class simply implements Net interface */
export class SimpleNet implements Net {
    private readonly axios: AxiosInstance;

    constructor(
        readonly baseURL: string,
        timeout = 30 * 1000,
        private readonly wsTimeout = 30 * 1000
    ) {
        this.axios = Axios.create({
            httpAgent: new HttpAgent({ keepAlive: true }),
            httpsAgent: new HttpsAgent({ keepAlive: true }),
            baseURL,
            timeout
        });
    }

    public async http(
        method: 'GET' | 'POST',
        path: string,
        params?: Net.Params
    ): Promise<unknown> {
        params = params ?? {};
        try {
            const resp = await this.axios.request({
                method,
                url: path,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                data: params.body,
                headers: params.headers,
                params: params.query
            });
            // if (params.validateResponseHeader != null) {
            //     params.validateResponseHeader(resp.headers);
            // }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return resp.data;
        } catch (err) {
            const axiosError = err as AxiosError<string>;
            if (axiosError.isAxiosError) {
                throw convertError(err as AxiosError<string>);
            }
            throw new Error(
                `${method} ${new URL(path, this.baseURL).toString()}: ${
                    (err as Error).message
                }`
            );
        }
    }

    public openWebSocketReader(path: string): Net.WebSocketReader {
        const url = new URL(this.baseURL, path)
            .toString()
            .replace(/^http:/i, 'ws:')
            .replace(/^https:/i, 'wss:');
        return new SimpleWebSocketReader(url, this.wsTimeout);
    }
}

function convertError(err: AxiosError): Error {
    if (err.response !== null && err.response !== undefined) {
        const resp = err.response;
        if (typeof resp.data === 'string') {
            let text = resp.data.trim();
            if (text.length > 50) {
                text = text.slice(0, 50) + '...';
            }
            return new Error(
                `${resp.status} ${err.config?.method} ${err.config?.url}: ${text}`
            );
        } else {
            return new Error(
                `${resp.status} ${err.config?.method} ${err.config?.url}`
            );
        }
    } else {
        return new Error(
            `${err.config?.method} ${err.config?.url}: ${err.message}`
        );
    }
}
