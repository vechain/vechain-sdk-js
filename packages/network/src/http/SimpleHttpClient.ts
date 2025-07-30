import { HttpMethod } from './HttpMethod';
import {
    InvalidHTTPParams,
    InvalidHTTPRequest,
    InvalidHTTPResponse
} from '@vechain/sdk-errors';
import { type HttpClient } from './HttpClient';
import { type HttpParams } from './HttpParams';
import { logRequest, logResponse, logError } from './trace-logger';

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
    public static readonly DEFAULT_TIMEOUT = 10000;

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
     * Determines if specified url is valid
     * @param {string} url Url to check
     * @returns {boolean} if value
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Executes an HTTP request with the specified method, path, and optional parameters.
     *
     * @param {HttpMethod} method - The HTTP method to use for the request (e.g., GET, POST).
     * @param {string} path - The URL path for the request. Leading slashes will be automatically removed.
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

        let url: URL | undefined;
        let requestStartTime = Date.now(); // Initialize with current timestamp
        let headerObj: Record<string, string> = {};

        try {
            // Remove leading slash from path
            if (path.startsWith('/')) {
                path = path.slice(1);
            }
            // Add trailing slash from baseURL if not present
            let baseURL = this.baseURL;
            if (!baseURL.endsWith('/')) {
                baseURL += '/';
            }
            // Check if path is already a fully qualified URL
            if (/^https?:\/\//.exec(path)) {
                url = new URL(path);
            } else {
                url = new URL(path, baseURL);
            }

            if (params?.query && url !== undefined) {
                Object.entries(params.query).forEach(([key, value]) => {
                    (url as URL).searchParams.append(key, String(value));
                });
            }

            if (
                params?.query !== undefined &&
                params?.query != null &&
                url !== undefined
            ) {
                Object.entries(params.query).forEach(([key, value]) => {
                    (url as URL).searchParams.append(key, String(value));
                });
            }

            const headers = new Headers(this.headers);
            if (params?.headers !== undefined && params?.headers != null) {
                Object.entries(params.headers).forEach(([key, value]) => {
                    headers.append(key, String(value));
                });
            }

            // Convert Headers to plain object for logging
            headerObj = Object.fromEntries(headers.entries());

            // Log the request
            requestStartTime = logRequest(
                method,
                url.toString(),
                headerObj,
                method !== HttpMethod.GET ? params?.body : undefined
            );

            // Send request
            const response = await fetch(url.toString(), {
                method,
                headers,
                body:
                    method !== HttpMethod.GET
                        ? JSON.stringify(params?.body)
                        : undefined,
                signal: controller.signal
            });

            const responseHeaders = Object.fromEntries(
                response.headers.entries()
            );

            if (response.ok) {
                if (
                    params?.validateResponseHeader != null &&
                    responseHeaders != null
                ) {
                    params.validateResponseHeader(responseHeaders);
                }

                // Parse response body
                // Using explicit type annotation to handle the 'any' returned by response.json()
                const responseBody: unknown = await response.json();

                // Log the successful response
                logResponse(
                    requestStartTime,
                    url.toString(),
                    responseHeaders,
                    responseBody
                );

                // Return the responseBody as unknown rather than 'any'
                return responseBody;
            }
            let message = `HTTP ${response.status} ${response.statusText}`;

            // append the API response text if available
            await response
                .text()
                .then((text) => {
                    if (text) {
                        message += `: ${text}`;
                    }
                })
                .catch();

            throw new InvalidHTTPResponse('SimpleHttpClient.http()', message, {
                method,
                path,
                status: response.status,
                message
            });
        } catch (error) {
            if (error instanceof InvalidHTTPResponse) {
                throw error; // Re-throw if it's already an InvalidHTTPResponse
            }
            // Different error handling based on whether it's a params error or request error
            if (url) {
                // Log the error if url is defined (request was started)
                const urlString = url.toString();
                logError(requestStartTime, urlString, method, error);

                throw new InvalidHTTPRequest(
                    'HttpClient.http()',
                    (error as Error).message,
                    {
                        method,
                        url: urlString
                    },
                    error
                );
            } else {
                // Parameter error before request was even started
                const fallbackUrl = !this.isValidUrl(this.baseURL)
                    ? path
                    : new URL(path, this.baseURL).toString();

                throw new InvalidHTTPParams(
                    'HttpClient.http()',
                    (error as Error).message,
                    {
                        method,
                        url: fallbackUrl
                    },
                    error
                );
            }
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
