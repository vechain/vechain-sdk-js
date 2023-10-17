import {
    type Net,
    type NetParams,
    type NetWebSocketReader
} from './interfaces';
import Axios, { type AxiosInstance, type AxiosError } from 'axios';
import { SimpleWebSocketReader } from './simple-websocket-reader';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';

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

    /**
     * Creates a new `SimpleNet` instance with the specified base URL, HTTP timeout, and WebSocket timeout.
     *
     * @param baseURL - The base URL for all network requests.
     * @param timeout - The HTTP request timeout in milliseconds (default: 30 seconds).
     * @param wsTimeout - The WebSocket connection timeout in milliseconds (default: 30 seconds).
     */
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
        params = params ?? undefined;
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
            throw new Error(
                `${method} ${new URL(path, this.baseURL).toString()}: ${
                    (err as Error).message
                }`
            );
        }
    }

    /**
     * Open a WebSocket reader for the specified path.
     *
     * @param path - The path to open a WebSocket connection.
     * @returns A WebSocket reader for the provided path.
     */
    public openWebSocketReader(path: string): NetWebSocketReader {
        const url = new URL(this.baseURL, path)
            .toString()
            .replace(/^http:/i, 'ws:')
            .replace(/^https:/i, 'wss:');
        return new SimpleWebSocketReader(url, this.wsTimeout);
    }
}

/**
 * Converts an AxiosError into a standard Error.
 *
 * This function converts an AxiosError, which may contain HTTP response details, into a standard Error.
 * It handles cases where the AxiosError has an HTTP response with status and data.
 *
 * @param err - The AxiosError to convert into an Error.
 * @returns A standard Error with a descriptive message.
 */
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
