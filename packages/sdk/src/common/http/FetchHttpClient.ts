import fastJsonStableStringify from 'fast-json-stable-stringify';
import { IllegalArgumentError } from '../errors/IllegalArgumentError';
import { type HttpQuery, type HttpPath, type HttpClient } from '@common/http';
import { isValidNetworkUrl } from '@thor/thorest';
import { type HttpOptions } from './HttpOptions';
import { CookieStore } from './CookieStore';
import { log, type LogItem } from '@common/logging';

const FQP = 'packages/sdk/src/common/http/FetchHttpClient.ts';

// Types for dependency injection
type RequestConstructor = typeof Request;
type FetchFunction = typeof fetch;

/**
 * HTTP client implementation using the Fetch API.
 * Provides methods for making GET and POST requests to VeChain Thor networks.
 *
 * @example
 * ```typescript
 * const client = FetchHttpClient.at('https://testnet.vechain.org/');
 * const response = await client.get({ path: '/accounts/0x...' });
 * ```
 */
class FetchHttpClient implements HttpClient {
    private static readonly PATH_SEPARATOR = '/';
    public readonly baseURL: URL;
    public readonly options: HttpOptions;

    // Injectable dependencies
    private readonly requestConstructor: RequestConstructor;
    private readonly fetchFunction: FetchFunction;

    // Cookie store
    private readonly cookieStore: CookieStore;

    constructor(
        baseURL: URL,
        httpOptions: HttpOptions = {},
        // Default dependencies to global objects, allows for testing injection or custom implementations
        requestConstructor: RequestConstructor = Request,
        fetchFunction: FetchFunction = fetch
    ) {
        if (!baseURL.pathname.endsWith(FetchHttpClient.PATH_SEPARATOR)) {
            baseURL.pathname += FetchHttpClient.PATH_SEPARATOR;
        }
        // validate callback functions
        if (httpOptions.onRequest === undefined) {
            httpOptions.onRequest = (request) => request;
        }
        if (httpOptions.onResponse === undefined) {
            httpOptions.onResponse = (response) => response;
        }
        // set properties
        this.baseURL = baseURL;
        this.requestConstructor = requestConstructor;
        this.fetchFunction = fetchFunction;
        this.options = httpOptions;
        this.cookieStore = new CookieStore();
    }

    /**
     * Creates a new FetchHttpClient instance.
     * @param baseURL - The base URL of the network.
     * @param onRequest - A function to modify the request before it is sent.
     * @param onResponse - A function to modify the response after it is received.
     * @param requestConstructor - The constructor to use for creating Request objects.
     * @param fetchFunction - The function to use for making HTTP requests.
     * @param httpOptions - The options to use for the HTTP client.
     * @returns A new FetchHttpClient instance.
     */
    static at(
        baseURL: URL,
        httpOptions: HttpOptions = {},
        requestConstructor: RequestConstructor = Request,
        fetchFunction: FetchFunction = fetch
    ): FetchHttpClient {
        return new FetchHttpClient(
            baseURL,
            httpOptions,
            requestConstructor,
            fetchFunction
        );
    }

    /**
     * Builds the request URL.
     * @param httpPath - The path of the request.
     * @param httpQuery - The query parameters of the request.
     * @returns The request URL.
     */
    private buildRequestUrl(httpPath: HttpPath, httpQuery: HttpQuery): URL {
        const pathUrl = new URL(this.baseURL.toString());
        pathUrl.pathname += httpPath.path.startsWith(
            FetchHttpClient.PATH_SEPARATOR
        )
            ? httpPath.path.slice(1)
            : httpPath.path;
        pathUrl.search = httpQuery.query;
        return pathUrl;
    }

    /**
     * Creates an AbortSignal for timeout functionality.
     * @returns AbortSignal or undefined if no timeout is set.
     */
    private createAbortSignal(): AbortSignal | undefined {
        if (this.options.timeout === undefined) {
            return undefined;
        }
        const controller = new AbortController();
        setTimeout(() => {
            controller.abort();
        }, this.options.timeout);
        return controller.signal;
    }

    /**
     * Builds headers for the request, including stored cookies if enabled.
     * @returns Headers object for the request.
     */
    private buildHeaders(): Record<string, string> {
        const headers: Record<string, string> = { ...this.options.headers };
        // Add stored cookies if cookie storage is enabled
        if (this.options.storeCookies === true) {
            const cookieHeader = this.cookieStore.getCookieHeader();
            if (cookieHeader !== '') {
                headers.Cookie = cookieHeader;
            }
        }
        return headers;
    }

    /**
     * Processes the response and stores cookies if enabled.
     * @param response - The response to process.
     * @returns The processed response.
     */
    private processResponse(response: Response): Response {
        // Store cookies from response if cookie storage is enabled
        if (this.options.storeCookies === true) {
            this.cookieStore.storeFromResponse(response);
        }
        return response;
    }

    /**
     * Makes a GET request.
     * @param httpPath - The path of the request.
     * @param httpQuery - The query parameters of the request.
     * @returns The response from the request.
     */
    async get(
        httpPath: HttpPath = { path: '' },
        httpQuery: HttpQuery = { query: '' }
    ): Promise<Response> {
        const pathUrl = this.buildRequestUrl(httpPath, httpQuery);
        const RequestClass = this.requestConstructor as unknown as new (
            input: URL | RequestInfo,
            init?: RequestInit
        ) => Request;
        const requestInit: RequestInit = {
            method: 'GET',
            headers: this.buildHeaders(),
            signal: this.createAbortSignal()
        };
        const request = new RequestClass(pathUrl, requestInit);
        const response = await this.fetchFunction(
            this.options.onRequest?.(request) ?? request
        );
        await this.logResponse(request, response);
        return (
            this.options.onResponse?.(this.processResponse(response)) ??
            response
        );
    }

    /**
     * Makes a POST request.
     * @param httpPath - The path of the request.
     * @param httpQuery - The query parameters of the request.
     * @param body - The body of the request.
     * @returns The response from the request.
     */
    async post(
        httpPath: HttpPath = { path: '' },
        httpQuery: HttpQuery = { query: '' },
        body?: unknown
    ): Promise<Response> {
        const pathUrl = this.buildRequestUrl(httpPath, httpQuery);
        const RequestClass = this.requestConstructor as unknown as new (
            input: URL | RequestInfo,
            init?: RequestInit
        ) => Request;
        const requestInit: RequestInit = {
            body:
                body !== undefined ? fastJsonStableStringify(body) : undefined,
            method: 'POST',
            headers: this.buildHeaders(),
            signal: this.createAbortSignal()
        };
        const request = new RequestClass(pathUrl, requestInit);
        const response = await this.fetchFunction(
            this.options.onRequest?.(request) ?? request
        );
        await this.logResponse(request, response);
        return (
            this.options.onResponse?.(this.processResponse(response)) ??
            response
        );
    }

    /**
     * Logs the request and response details.
     * @param request - The request to log.
     * @param response - The response to log.
     */
    private async logResponse(
        request: Request,
        response: Response
    ): Promise<void> {
        try {
            const requestClone = request != null ? request.clone() : undefined;
            const responseClone =
                response != null ? response.clone() : undefined;
            const requestDetails = {
                method: requestClone?.method,
                url: requestClone?.url,
                body: await requestClone?.text()
            };
            const responseDetails = {
                statusCode: response?.status,
                statusText: response?.statusText,
                body: await responseClone?.text()
            };
            // compute log level based on response status
            // if response is undefined, log as warning
            // if response status is >= 400, log as error
            // otherwise, log as debug
            const logLevel =
                response === undefined
                    ? 'warn'
                    : response?.status >= 400
                      ? 'error'
                      : 'debug';
            const logItem: LogItem = {
                verbosity: logLevel,
                message: 'HTTP Response',
                source: 'FetchHttpClient',
                context: {
                    data: { request: requestDetails, response: responseDetails }
                }
            };
            log(logItem);
        } catch (err) {
            console.error('❌ FetchHttpClient.logResponse failed:', err);
        }
    }
}

export { FetchHttpClient };
