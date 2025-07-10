import fastJsonStableStringify from 'fast-json-stable-stringify';
import { IllegalArgumentError } from '../errors/IllegalArgumentError';

import { type HttpQuery, type HttpPath, type HttpClient } from '@http';
import { isValidNetworkUrl } from '../index';

const FQP = 'packages/core/http/FetchHttpClient.ts'; // FIX path

// Types for dependency injection
type RequestConstructor = typeof Request;
type FetchFunction = typeof fetch;

// FIX JSdoc
class FetchHttpClient implements HttpClient {
    private static readonly PATH_SEPARATOR = '/';

    public readonly baseURL: URL;

    private readonly onRequest: (request: Request) => Request;

    private readonly onResponse: (response: Response) => Response;

    // Injectable dependencies
    private readonly requestConstructor: RequestConstructor;
    private readonly fetchFunction: FetchFunction;

    constructor(
        baseURL: URL,
        onRequest: (request: Request) => Request,
        onResponse: (response: Response) => Response,
        // Default dependencies to global objects, allows for testing injection or custom implementations
        requestConstructor: RequestConstructor = Request,
        fetchFunction: FetchFunction = fetch
    ) {
        if (!isValidNetworkUrl(baseURL)) {
            throw new IllegalArgumentError(
                `${FQP}FetchHttpClient.constructor(baseURL: URL, onRequest: (request: Request) => Request,onResponse: (response: Response) => Response): FetchHttpClient)`,
                'Invalid network URL. Only ThorNetworks URLs are allowed.',
                { baseURL }
            );
        }
        if (!baseURL.pathname.endsWith(FetchHttpClient.PATH_SEPARATOR)) {
            baseURL.pathname += FetchHttpClient.PATH_SEPARATOR;
        }
        this.baseURL = baseURL;
        this.onRequest = onRequest;
        this.onResponse = onResponse;
        this.requestConstructor = requestConstructor;
        this.fetchFunction = fetchFunction;
    }

    static at(
        baseURL: string,
        onRequest: (request: Request) => Request = (request) => request,
        onResponse: (response: Response) => Response = (response) => response,
        requestConstructor: RequestConstructor = Request,
        fetchFunction: FetchFunction = fetch
    ): FetchHttpClient {
        return new FetchHttpClient(
            new URL(baseURL),
            onRequest,
            onResponse,
            requestConstructor,
            fetchFunction
        );
    }

    async get(
        httpPath: HttpPath = { path: '' },
        httpQuery: HttpQuery = { query: '' }
    ): Promise<Response> {
        const pathUrl = new URL(this.baseURL.toString());
        pathUrl.pathname += httpPath.path.startsWith(
            FetchHttpClient.PATH_SEPARATOR
        )
            ? httpPath.path.slice(1)
            : httpPath.path;
        pathUrl.search = httpQuery.query;

        const RequestClass = this.requestConstructor as unknown as new (
            input: URL | RequestInfo,
            init?: RequestInit
        ) => Request;
        const request = new RequestClass(pathUrl);
        const response = await this.fetchFunction(this.onRequest(request));
        return this.onResponse(response);
    }

    async post(
        httpPath: HttpPath = { path: '' },
        httpQuery: HttpQuery = { query: '' },
        body?: unknown
    ): Promise<Response> {
        const pathUrl = new URL(this.baseURL.toString());
        pathUrl.pathname += httpPath.path.startsWith(
            FetchHttpClient.PATH_SEPARATOR
        )
            ? httpPath.path.slice(1)
            : httpPath.path;
        pathUrl.search = httpQuery.query;

        const RequestClass = this.requestConstructor as unknown as new (
            input: URL | RequestInfo,
            init?: RequestInit
        ) => Request;
        const request = new RequestClass(pathUrl, {
            body:
                body !== undefined ? fastJsonStableStringify(body) : undefined,
            method: 'POST'
        });
        const response = await this.fetchFunction(this.onRequest(request));
        return this.onResponse(response);
    }
}

export { FetchHttpClient };
