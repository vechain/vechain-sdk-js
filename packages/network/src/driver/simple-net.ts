import Axios, { type AxiosInstance, type AxiosError } from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { type Net, type NetParams } from './interfaces';
import { convertError } from '../utils';
import { type Block } from '../types';

/**
 * Represents a concrete implementation of the `Net` interface, providing methods for making HTTP requests and
 * opening WebSocket readers.
 *
 * This class uses Axios for HTTP requests and allows interaction with both HTTP and WebSocket connections.
 *
 * @public
 */
class SimpleNet implements Net {
    protected readonly axios: AxiosInstance;

    /**
     * Creates a new `SimpleNet` instance with the specified base URL, HTTP timeout, and WebSocket timeout.
     *
     * @param baseURL - The base URL for all network requests.
     * @param timeout - The HTTP request timeout in milliseconds (default: 30 seconds).
     */
    constructor(
        readonly baseURL: string,
        timeout: number = 30 * 1000,
        private readonly wsTimeout = 30 * 1000
    ) {
        this.axios = Axios.create({
            httpAgent: new HttpAgent({ keepAlive: true }),
            httpsAgent: new HttpsAgent({ keepAlive: true }),
            baseURL,
            timeout
        });
    }

    /**
     * Perform an HTTP request using the Axios library.
     *
     * @param method - The HTTP request method ('GET' or 'POST').
     * @param path - The path to access on the server.
     * @param params - Additional request parameters, such as query parameters, request body, and custom headers.
     * @returns A promise that resolves with the response data from the HTTP request.
     * @throws An error if the request fails.
     */
    public async http(
        method: 'GET' | 'POST',
        path: string,
        params?: NetParams
    ): Promise<Block | undefined> {
        try {
            const resp = await this.axios.request({
                method,
                url: path,
                data: params?.body,
                headers: params?.headers,
                params: params?.query
            });

            if (params?.validateResponseHeader != null) {
                const responseHeaders: Record<string, string> = {};

                for (const key in resp.headers) {
                    const value: unknown = resp.headers[key];

                    if (typeof value === 'string') {
                        responseHeaders[key] = value;
                    }
                }

                params.validateResponseHeader(responseHeaders);
            }

            return resp.data as Block;
        } catch (err) {
            const axiosError = err as AxiosError<string>;
            if (axiosError.isAxiosError) {
                throw convertError(err as AxiosError<string>);
            }
        }
    }
}

export { SimpleNet };
