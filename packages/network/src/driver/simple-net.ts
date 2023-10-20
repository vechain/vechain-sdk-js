import {
    type Net,
    type NetParams,
    type NetWebSocketReader
} from './interfaces';
import Axios, { type AxiosInstance, type AxiosError } from 'axios';
import { SimpleWebSocketReader } from './simple-websocket-reader';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { convertError } from './utils/errors';

/**
 * Represents a concrete implementation of the `Net` interface, providing methods for making HTTP requests and
 * opening WebSocket readers.
 *
 * This class uses Axios for HTTP requests and allows interaction with both HTTP and WebSocket connections.
 *
 * @public
 */
export class SimpleNet implements Net {
    private readonly axios: AxiosInstance;
    private readonly wsTimeout: number;

    /**
     * Creates a new `SimpleNet` instance with the specified base URL, HTTP timeout, and WebSocket timeout.
     *
     * @param baseURL - The base URL for all network requests.
     * @param timeout - The HTTP request timeout in milliseconds (default: 30 seconds).
     * @param wsTimeout - The WebSocket connection timeout in milliseconds (default: 30 seconds).
     */
    constructor(
        readonly baseURL: string,
        timeout: number = 30 * 1000,
        wsTimeout?: number
    ) {
        // Use the provided wsTimeout or a default value if not provided
        this.wsTimeout = wsTimeout ?? 30000; // 30 seconds by default

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
    ): Promise<unknown> {
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
                    const value = resp.headers[key] as string;

                    if (typeof value === 'string') {
                        responseHeaders[key] = value;
                    }
                }

                params.validateResponseHeader(responseHeaders);
            }

            return resp.data as unknown;
        } catch (err) {
            const axiosError = err as AxiosError<string>;
            if (axiosError.isAxiosError) {
                throw convertError(err as AxiosError<string>);
            }
        }
    }

    /**
     * Open a WebSocket reader for the specified path.
     *
     * @param path - The path to open a WebSocket connection.
     * @returns A WebSocket reader for the provided path.
     */
    public openWebSocketReader(path: string): NetWebSocketReader {
        // Ensure that this.baseURL and path are not empty
        if (this.baseURL === '') {
            throw new Error('baseURL is empty');
        }
        if (path === '') {
            throw new Error('path is empty');
        }

        const url = (this.baseURL + path)
            .replace(/^http:/i, 'ws:')
            .replace(/^https:/i, 'wss:');
        return new SimpleWebSocketReader(url, this.wsTimeout);
    }
}
