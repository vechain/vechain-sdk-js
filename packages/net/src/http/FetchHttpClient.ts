import { type HttpClient } from './HttpClient';
import { type HttpPath } from './HttpPath';
import { type HttpQuery } from './HttpQuery';

class FetchHttpClient implements HttpClient {
    private static readonly PATH_SEPARATOR = '/';

    public readonly baseURL: string;

    private readonly onRequest: (request: Request) => Request;

    private readonly onResponse: (response: Response) => Response;

    constructor(
        baseURL: string,
        onRequest: (request: Request) => Request,
        onResponse: (response: Response) => Response
    ) {
        this.baseURL = baseURL.endsWith(FetchHttpClient.PATH_SEPARATOR)
            ? baseURL.substring(0, baseURL.length - 1)
            : baseURL;
        this.onRequest = onRequest;
        this.onResponse = onResponse;
    }

    static at(
        baseURL: string,
        onRequest: (request: Request) => Request = (request) => request,
        onResponse: (response: Response) => Response = (response) => response
    ): FetchHttpClient {
        return new FetchHttpClient(baseURL, onRequest, onResponse);
    }

    async get(
        httpPath: HttpPath = {
            path: ''
        },
        httpQuery: HttpQuery = {
            query: ''
        }
    ): Promise<Response> {
        const path = httpPath.path.startsWith(FetchHttpClient.PATH_SEPARATOR)
            ? httpPath.path.substring(1)
            : httpPath.path;
        const request = new Request(
            `${this.baseURL}${FetchHttpClient.PATH_SEPARATOR}${path}${httpQuery.query}`
        );
        const response = await fetch(this.onRequest(request));
        return this.onResponse(response);
    }

    async post(
        httpPath: HttpPath = {
            path: ''
        },
        httpQuery: HttpQuery = {
            query: ''
        },
        body?: unknown
    ): Promise<Response> {
        const path = httpPath.path.startsWith(FetchHttpClient.PATH_SEPARATOR)
            ? httpPath.path.substring(1)
            : httpPath.path;
        const request = new Request(
            `${this.baseURL}${FetchHttpClient.PATH_SEPARATOR}${path}${httpQuery.query}`,
            {
                body: JSON.stringify(body),
                method: 'POST'
            }
        );
        const response = await fetch(this.onRequest(request));
        return this.onResponse(response);
    }
}

export { FetchHttpClient };
