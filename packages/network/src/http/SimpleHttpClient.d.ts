import { HttpMethod } from './HttpMethod';
import { type HttpClient } from './HttpClient';
import { type HttpParams } from './HttpParams';
/**
 * This class implements the HttpClient interface using the Fetch API.
 *
 * The SimpleHttpClient allows making {@link HttpMethod} requests with timeout
 * and base URL configuration.
 */
declare class SimpleHttpClient implements HttpClient {
    /**
     * Represent the default timeout duration for network requests in milliseconds.
     */
    static readonly DEFAULT_TIMEOUT = 10000;
    /**
     * Return the root URL for the API endpoints.
     */
    readonly baseURL: string;
    readonly headers: HeadersInit;
    /**
     * Return the amount of time in milliseconds before a timeout occurs
     * when requesting with HTTP methods.
     */
    readonly timeout: number;
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
    constructor(baseURL: string, headers?: HeadersInit, timeout?: number);
    /**
     * Sends an HTTP GET request to the specified path with optional query parameters.
     *
     * @param {string} path - The endpoint path to which the HTTP GET request is sent.
     * @param {HttpParams} [params] - Optional parameters for the request,
     * including query parameters, headers, body, and response validation.
     * {@link HttpParams.headers} override {@link SimpleHttpClient.headers}.
     * @return {Promise<unknown>} A promise that resolves with the response of the GET request.
     */
    get(path: string, params?: HttpParams): Promise<unknown>;
    /**
     * Determines if specified url is valid
     * @param {string} url Url to check
     * @returns {boolean} if value
     */
    private isValidUrl;
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
    http(method: HttpMethod, path: string, params?: HttpParams): Promise<unknown>;
    /**
     * Makes an HTTP POST request to the specified path with optional parameters.
     *
     * @param {string} path - The endpoint to which the POST request is made.
     * @param {HttpParams} [params] - Optional parameters for the request,
     * including query parameters, headers, body, and response validation.
     * {@link HttpParams.headers} override {@link SimpleHttpClient.headers}.
     * @return {Promise<unknown>} A promise that resolves with the response from the server.
     */
    post(path: string, params?: HttpParams): Promise<unknown>;
}
export { SimpleHttpClient };
//# sourceMappingURL=SimpleHttpClient.d.ts.map