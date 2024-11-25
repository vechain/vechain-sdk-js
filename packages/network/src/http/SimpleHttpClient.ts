import { HttpMethod } from './HttpMethod';
import { InvalidHTTPRequest } from '@vechain/sdk-errors';
import { type HttpClient } from './HttpClient';
import { type HttpParams } from './HttpParams';

/**
 * This class implements the HttpClient interface using the Fetch API.
 *
 * The SimpleHttpClient allows making {@link HttpMethod} requests with timeout
 * and base URL configuration.
 */
class SimpleHttpClient implements HttpClient {
    /**
     * Represent the default timeout duration for network requests in milliseconds.
     */
    public static readonly DEFAULT_TIMEOUT = 30000;

    /**
     * Return the root URL for the API endpoints.
     */
    public readonly baseURL: string;

    public readonly headers: HeadersInit;

    /**
     * Return the amount of time in milliseconds before a timeout occurs
     * when requesting with HTTP methods.
     */
    public readonly timeout: number;

    /**
     * Constructs an instance of SimpleHttpClient with the given base URL,
     * timeout period and HTTP headers.
     * The HTTP headers are used each time this client send a request to the URL,
     * if not overwritten by the {@link HttpParams} of the method sending the request.
     *
     * @param {string} baseURL - The base URL for HTTP requests.
     * @param {HeadersInit} [headers=new Headers()] - The default headers for HTTP requests.
     * @param {number} [timeout=SimpleHttpClient.DEFAULT_TIMEOUT] - The timeout duration in milliseconds.
     */
    constructor(
        baseURL: string,
        headers: HeadersInit = new Headers(),
        timeout: number = SimpleHttpClient.DEFAULT_TIMEOUT
    ) {
        this.baseURL = baseURL;
        this.timeout = timeout;
        this.headers = headers;
    }

    /**
     * Sends an HTTP GET request to the specified path with optional query parameters.
     *
     * @param {string} path - The endpoint path to which the HTTP GET request is sent.
     * @param {HttpParams} [params] - Optional parameters for the request,
     * including query parameters, headers, body, and response validation.
     * {@link HttpParams.headers} override {@link SimpleHttpClient.headers}.
     * @return {Promise<unknown>} A promise that resolves with the response of the GET request.
     */
    public async get(path: string, params?: HttpParams): Promise<unknown> {
        return await this.http(HttpMethod.GET, path, params);
    }

    /**
     * Executes an HTTP request with the specified method, path, and optional parameters.
     *
     * @param {HttpMethod} method - The HTTP method to use for the request (e.g., GET, POST).
     * @param {string} path - The URL path for the request.
     * @param {HttpParams} [params] - Optional parameters for the request,
     * including query parameters, headers, body, and response validation.
     * {@link HttpParams.headers} override {@link SimpleHttpClient.headers}.
     * @return {Promise<unknown>} A promise that resolves to the response of the HTTP request.
     * @throws {InvalidHTTPRequest} Throws an error if the HTTP request fails.
     */
    public async http(
        method: HttpMethod,
        path: string,
        params?: HttpParams
    ): Promise<unknown> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, this.timeout);
        try {
            const url = new URL(path, this.baseURL);
            if (params?.query != null) {
                Object.entries(params.query).forEach(([key, value]) => {
                    url.searchParams.append(key, String(value));
                });
            }
            const headers = new Headers(this.headers);
            if (params?.headers !== undefined && params?.headers != null) {
                Object.entries(params.headers).forEach(([key, value]) => {
                    headers.append(key, String(value));
                });
            }
            const response = await fetch(url, {
                method,
                headers: params?.headers as HeadersInit,
                body:
                    method !== HttpMethod.GET
                        ? JSON.stringify(params?.body)
                        : undefined,
                signal: controller.signal
            });
            if (response.ok) {
                const responseHeaders = Object.fromEntries(
                    response.headers.entries()
                );
                if (
                    params?.validateResponseHeader != null &&
                    responseHeaders != null
                ) {
                    params.validateResponseHeader(responseHeaders);
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return await response.json();
            }
            throw new Error(`HTTP ${response.status} ${response.statusText}`, {
                cause: response
            });
        } catch (error) {
            throw new InvalidHTTPRequest(
                'HttpClient.http()',
                (error as Error).message,
                {
                    method,
                    url: `${this.baseURL}${path}`
                },
                error
            );
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Makes an HTTP POST request to the specified path with optional parameters.
     *
     * @param {string} path - The endpoint to which the POST request is made.
     * @param {HttpParams} [params] - Optional parameters for the request,
     * including query parameters, headers, body, and response validation.
     * {@link HttpParams.headers} override {@link SimpleHttpClient.headers}.
     * @return {Promise<unknown>} A promise that resolves with the response from the server.
     */
    public async post(path: string, params?: HttpParams): Promise<unknown> {
        return await this.http(HttpMethod.POST, path, params);
    }
}

export { SimpleHttpClient };
