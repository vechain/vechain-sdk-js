import Axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { type HttpClientOptions, type HttpParams } from './types';
import { convertError, DEFAULT_HTTP_TIMEOUT } from '../index';
import { buildError, HTTP_CLIENT } from '@vechain/sdk-errors';

/**
 * Represents a concrete implementation of the `IHttpClient` interface, providing methods for making HTTP requests.
 *
 * This class leverages Axios for handling HTTP requests and allows for interaction with HTTP services.
 * It is configured with a base URL and request timeout upon instantiation.
 */
class HttpClient {
    /**
     * Axios instance to make http requests
     */
    protected readonly axios: AxiosInstance;

    /**
     * Instantiates an `HttpClient` object with a specified base URL and HTTP request timeout.
     *
     * @param baseURL - The base URL for all network requests.
     * @param options - (Optional) An object containing additional configuration options for the HTTP client, such as a custom Axios instance and a request timeout.
     */
    constructor(
        readonly baseURL: string,
        options?: HttpClientOptions
    ) {
        this.axios =
            options?.axiosInstance ??
            Axios.create({
                httpAgent: new HttpAgent({ keepAlive: false }),
                httpsAgent: new HttpsAgent({ keepAlive: false }),
                baseURL,
                timeout: options?.timeout ?? DEFAULT_HTTP_TIMEOUT
            });
    }

    /**
     * Sends an HTTP request using the Axios library.
     *
     * @param method - The HTTP method to be used ('GET' or 'POST').
     * @param path - The path to access on the server relative to the base URL.
     * @param params - (Optional) Additional request parameters such as query parameters, request body, and custom headers.
     * @returns A promise that resolves to the response data from the HTTP request.
     * @throws {HTTPClientError} Will throw an error if the request fails, with more detailed information if the error is Axios-specific.
     */
    public async http(
        method: 'GET' | 'POST',
        path: string,
        params?: HttpParams
    ): Promise<unknown> {
        const config: AxiosRequestConfig = {
            method,
            url: path,
            data: params?.body,
            headers: params?.headers,
            params: params?.query
        };

        try {
            const resp = await this.axios(config);
            this.validateResponseHeader(params, resp.headers);
            return resp.data as unknown;
        } catch (err) {
            if (Axios.isAxiosError(err)) {
                throw convertError(err);
            }
            // If it's not an Axios error, re-throw the original error
            throw buildError(
                'http',
                HTTP_CLIENT.INVALID_HTTP_REQUEST,
                'HTTP request failed: Check method, path, and parameters for validity.',
                { method, path, params },
                err
            );
        }
    }

    /**
     * Validates the response headers if a validation function is provided.
     *
     * @param params - (Optional) The request parameters.
     * @param headers - The response headers.
     */
    private validateResponseHeader(
        params?: HttpParams,
        headers?: Record<string, unknown>
    ): void {
        if (params?.validateResponseHeader != null && headers != null) {
            const responseHeaders: Record<string, string> = {};
            for (const key in headers) {
                const value = headers[key];
                if (typeof value === 'string') {
                    responseHeaders[key] = value;
                }
            }
            params.validateResponseHeader(responseHeaders);
        }
    }
}

export { HttpClient };
