import { type HttpMethod } from './HttpMethod';
import { type HttpParams } from './HttpParams';

/**
 * Interface representing an HTTP client.
 *
 * The HttpClient interface provides methods for making HTTP requests
 */
export interface HttpClient {
    /**
     * The base URL for the API requests.
     * This endpoint serves as the root URL for constructing all subsequent API calls.
     */
    baseURL: string;

    /**
     * Makes an HTTP GET request to the specified path with optional query parameters.
     *
     * @param {string} path - The endpoint path for the GET request.
     * @param {HttpParams} [params] - Optional query parameters to include in the request.
     * @return {Promise<unknown>} A promise that resolves to the response of the GET request.
     */
    get: (path: string, params?: HttpParams) => Promise<unknown>;

    /**
     * Sends an HTTP request using the specified method, path, and optional parameters.
     *
     * @param {HttpMethod} method - The HTTP method to be used for the request (e.g., 'GET', 'POST').
     * @param {string} path - The endpoint path for the HTTP request.
     * @param {HttpParams} [params] - Optional parameters to include in the HTTP request.
     * @returns {Promise<unknown>} A promise that resolves with the response of the HTTP request.
     */
    http: (
        method: HttpMethod,
        path: string,
        params?: HttpParams
    ) => Promise<unknown>;

    /**
     * Sends a POST request to the specified path with the given parameters.
     *
     * @param {string} path - The endpoint to which the POST request is sent.
     * @param {HttpParams} [params] - Optional parameters to be included in the POST request body.
     * @returns {Promise<unknown>} - A promise that resolves to the response of the POST request.
     */
    post: (path: string, params?: HttpParams) => Promise<unknown>;
}
