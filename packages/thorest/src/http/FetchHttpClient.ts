import { type HttpClient } from './HttpClient';
import { type HttpPath } from './HttpPath';
import { type HttpQuery } from './HttpQuery';
import { isValidNetworkUrl } from '../thor/ThorNetworks';

class FetchHttpClient implements HttpClient {
    private static readonly PATH_SEPARATOR = '/';

    public readonly baseURL: string;

    private readonly onRequest: (request: Request) => Request;

    private readonly onResponse: (response: Response) => Response;

    constructor(
        baseURL: URL,
        onRequest: (request: Request) => Request,
        onResponse: (response: Response) => Response
    ) {
        if (!isValidNetworkUrl(baseURL)) {
            throw new Error(
                'Invalid network URL. Only ThorNetworks URLs are allowed.'
            );
        }
        if (!baseURL.pathname.endsWith(FetchHttpClient.PATH_SEPARATOR)) {
            baseURL.pathname += FetchHttpClient.PATH_SEPARATOR;
        }
        this.baseURL = baseURL.toString();
        this.onRequest = onRequest;
        this.onResponse = onResponse;
    }

    static at(
        baseURL: string,
        onRequest: (request: Request) => Request = (request) => request,
        onResponse: (response: Response) => Response = (response) => response
    ): FetchHttpClient {
        return new FetchHttpClient(new URL(baseURL), onRequest, onResponse);
    }

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
            body: JSON.stringify(body),
            method: 'POST'
        });
        const response = await fetch(this.onRequest(request));
        return this.onResponse(response);
    }
}

export { FetchHttpClient };
