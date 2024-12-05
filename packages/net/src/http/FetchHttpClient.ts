import { type HttpClient } from './HttpClient';
import { type HttpPath } from './HttpPath';

class FetchHttpClient implements HttpClient {
    private static readonly SLASH = '/';

    public readonly baseURL: string;

    private readonly onRequest: (request: Request) => Request;

    private readonly onResponse: (response: Response) => Response;

    constructor(
        baseURL: string,
        onRequest: (request: Request) => Request = (request) => request,
        onResponse: (response: Response) => Response = (response) => response
    ) {
        this.baseURL = baseURL.endsWith(FetchHttpClient.SLASH)
            ? baseURL.substring(0, baseURL.length - 1)
            : baseURL;
        this.onRequest = onRequest;
        this.onResponse = onResponse;
    }

    async get(
        httpPath: HttpPath = {
            path: ''
        }
    ): Promise<Response> {
        const path = httpPath.path.startsWith(FetchHttpClient.SLASH)
            ? httpPath.path.substring(1)
            : httpPath.path;
        const request = new Request(
            `${this.baseURL}${FetchHttpClient.SLASH}${path}`
        );
        const response = await fetch(this.onRequest(request));
        return this.onResponse(response);
    }
}

export { FetchHttpClient };
