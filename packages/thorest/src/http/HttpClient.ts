import { type HttpPath } from './HttpPath';
import { type HttpQuery } from './HttpQuery';

/**
 * Represents an HTTP client that provides methods for making HTTP GET and POST requests.
 */
interface HttpClient {
    /**
     * Sends an HTTP GET request to the specified path with the provided query parameters.
     *
     * @param {HttpPath} httpPath - The endpoint path to which the GET request is sent.
     * @param {HttpQuery} httpQuery - An object representing the query parameters for the request.
     * @returns {Promise<Response>} A promise that resolves to the response of the GET request.
     */
    get: (httpPath: HttpPath, httpQuery: HttpQuery) => Promise<Response>;

    /**
     * Sends an HTTP POST request to the specified path with the provided query parameters and body.
     *
     * @param {HttpPath} httpPath - The path of the HTTP endpoint to send the POST request.
     * @param {HttpQuery} httpQuery - The query parameters to include in the request.
     * @param {unknown} [body] - The optional request body to include in the POST request.
     * @returns {Promise<Response>} A promise that resolves to the response of the HTTP POST request.
     */
    post: (
        httpPath: HttpPath,
        httpQuery: HttpQuery,
        body?: unknown
    ) => Promise<Response>;
}

export { type HttpClient };
