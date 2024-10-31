import { type HttpClient } from './HttpClient';
import { HttpMethod } from './HttpMethod';
import { type HttpParams } from './HttpParams';
import { InvalidHTTPRequest } from '@vechain/sdk-errors';

class FetchHttpClient implements HttpClient {
    private static readonly GET = 'GET';

    private static readonly POST = 'POST';

    public readonly baseURL: string;

    public readonly timeout: number;

    constructor(baseURL: string, timeout: number) {
        this.baseURL = baseURL;
        this.timeout = timeout;
    }

    public async get(path: string, params?: HttpParams): Promise<unknown> {
        return await this.http(HttpMethod.GET, path, params);
    }

    public async http(
        method: HttpMethod,
        path: string,
        params?: HttpParams
    ): Promise<unknown> {
        try {
            const url = new URL(path, this.baseURL);
            if (params?.query != null) {
                Object.entries(params.query).forEach(([key, value]) => {
                    url.searchParams.append(key, value);
                });
            }
            const body =
                method === HttpMethod.GET
                    ? JSON.stringify(params?.body)
                    : undefined;
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => {
                abortController.abort();
            }, this.timeout);
            const request: RequestInit = {
                method: method.toString(),
                headers: params?.headers as HeadersInit,
                body,
                signal: abortController.signal
            };
            const response = await fetch(url.toString(), request);
            clearTimeout(timeoutId);
            if (response.ok) {
                if (
                    params?.validateResponseHeader != null &&
                    params?.headers != null
                ) {
                    params.validateResponseHeader(params.headers);
                }
                return await response.json();
            }
            throw new Error(
                `HTTP ${response.status} ${await response.text()}`,
                {
                    cause: response
                }
            );
        } catch (e) {
            throw new InvalidHTTPRequest(
                'FetchHttpClient.http()',
                (e as Error).message,
                {
                    method: method.toString(),
                    url: `${this.baseURL}${path}`
                },
                e
            );
        }
    }

    public async post(path: string, params?: HttpParams): Promise<unknown> {
        return await this.http(HttpMethod.POST, path, params);
    }
}

export { FetchHttpClient };
