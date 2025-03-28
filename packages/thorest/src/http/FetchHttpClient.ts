import fastJsonStableStringify from 'fast-json-stable-stringify';
import { IllegalArgumentError } from '../../../core/src';
import { isValidNetworkUrl } from '../thor';
import { type HttpClient } from './HttpClient';
import { type HttpPath } from './HttpPath';
import { type HttpQuery } from './HttpQuery';

/**
 * Full Qualified Path
 */
const FQP = 'packages/thorest/src/http/FetchHttpClient.ts!';

/**
 * FetchHttpClient is an HTTP client implementation that uses the Fetch API
 * for making HTTP requests. It provides methods for performing GET and POST
 * requests, as well as custom handlers for requests and responses.
 *
 * The FetchHttpClient ensures that all generated URLs are valid and conform
 * to a specific network's requirements. It automatically appends a path
 * separator at the end of the base URL if not present.
 *
 * Usage of this class assumes that integrations are adhering to the Fetch API
 * specification for requests, responses, and error handling.
 */
class FetchHttpClient implements HttpClient {
    /**
     * A constant variable representing the path separator used in URL.
     */
    private static readonly PATH_SEPARATOR = '/';

    /**
     * The base URL for constructing API endpoint requests.
     *
     * It is used to build full URLs for API requests by appending
     * specific endpoints or paths to this base address.
     */
    public readonly baseURL: string;

    /**
     * Defines a callback function that processes and potentially modifies a given Request object.
     *
     * @param {Request} request - The incoming request object to be handled.
     * @returns {Request} The modified or original request object.
     */
    private readonly onRequest: (request: Request) => Request;

    /**
     * Defines a callback function to be executed upon receiving a response.
     *
     * @param {Response} response - The response object received, typically from a network request or API call.
     * @returns {Response} The modified or processed response object.
     */
    private readonly onResponse: (response: Response) => Response;

    /**
     * Creates a new instance of the FetchHttpClient with the specified parameters.
     *
     * @param {URL} baseURL - The base URL for the HTTP client. Must be a valid network URL.
     * @param {(request: Request) => Request} onRequest - A callback function to modify the request before it is sent.
     * @param {(response: Response) => Response} onResponse - A callback function to process the response after it is received.
     * @param {(url: URL) => boolean} [isValid=isValidNetworkUrl] - A function to validate the base URL.
     * @throws {IllegalArgumentError} If the base URL is invalid or not a ThorNetworks URL.
     */
    protected constructor(
        baseURL: URL,
        onRequest: (request: Request) => Request,
        onResponse: (response: Response) => Response,
        isValid: (url: URL) => boolean
    ) {
        if (!isValid(baseURL)) {
            throw new IllegalArgumentError(
                FQP,
                'Invalid network URL. Only ThorNetworks URLs are allowed.',
                { baseURL }
            );
        }
        if (!baseURL.pathname.endsWith(FetchHttpClient.PATH_SEPARATOR)) {
            baseURL.pathname += FetchHttpClient.PATH_SEPARATOR;
        }
        this.baseURL = baseURL.toString();
        this.onRequest = onRequest;
        this.onResponse = onResponse;
    }

    /**
     * Creates an instance of FetchHttpClient configured with the specified base URL and optional request/response interceptors.
     *
     * @param {string} baseURL - The base URL to be used for HTTP requests.
     * @param {(request: Request) => Request} [onRequest] - An optional function to intercept and modify the outgoing request.
     * @param {(response: Response) => Response} [onResponse] - An optional function to intercept and modify the incoming response.
     * @param {(url: URL) => boolean} [isValid=isValidNetworkUrl] - A function to validate the base URL. Defaults to `isValidNetworkUrl`.
     * @return {FetchHttpClient} A new instance of FetchHttpClient configured with the specified parameters.
     */
    static at(
        baseURL: URL,
        onRequest: (request: Request) => Request = (request) => request,
        onResponse: (response: Response) => Response = (response) => response,
        isValid: (url: URL) => boolean = isValidNetworkUrl
    ): FetchHttpClient {
        return new FetchHttpClient(
            new URL(baseURL),
            onRequest,
            onResponse,
            isValid
        );
    }

    /**
     * Sends an HTTP GET request to the specified path and query and returns the server response.
     *
     * @param {HttpPath} [httpPath={ path: '' }] - The path for the HTTP request. Defaults to an empty path if not provided.
     * @param {HttpQuery} [httpQuery={ query: '' }] - The query parameters for the HTTP request. Defaults to an empty query string if not provided.
     * @return {Promise<Response>} - A promise that resolves to the server's response object.
     */
    async get(
        httpPath: HttpPath = { path: '' },
        httpQuery: HttpQuery = { query: '' }
    ): Promise<Response> {
        const url = new URL(this.baseURL);
        url.pathname += httpPath.path.startsWith(FetchHttpClient.PATH_SEPARATOR)
            ? httpPath.path.slice(1)
            : httpPath.path;
        url.search = httpQuery.query;

        const request = new Request(url);
        const response = await fetch(this.onRequest(request));
        return this.onResponse(response);
    }

    /**
     * Sends an HTTP POST request to the specified path with optional query parameters and request body.
     *
     * @param {HttpPath} [httpPath={ path: '' }] - The path to append to the base URL for the request.
     * @param {HttpQuery} [httpQuery={ query: '' }] - The query parameters to include in the request URL.
     * @param {unknown} [body] - The optional body to include in the POST request.
     * @return {Promise<Response>} A promise that resolves to the response of the POST request.
     */
    async post(
        httpPath: HttpPath = { path: '' },
        httpQuery: HttpQuery = { query: '' },
        body?: unknown
    ): Promise<Response> {
        const url = new URL(this.baseURL);
        url.pathname += httpPath.path.startsWith(FetchHttpClient.PATH_SEPARATOR)
            ? httpPath.path.slice(1)
            : httpPath.path;
        url.search = httpQuery.query;

        const request = new Request(url, {
            body: fastJsonStableStringify(body),
            method: 'POST'
        });
        const response = await fetch(this.onRequest(request));
        return this.onResponse(response);
    }
}

export { FetchHttpClient };
