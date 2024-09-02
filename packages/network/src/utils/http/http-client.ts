import {
    type HttpClientOptions,
    type HttpParams,
    type IHttpClient
} from './types';
import { DEFAULT_HTTP_TIMEOUT } from '../index';
import { InvalidHTTPRequest } from '@vechain/sdk-errors';

/**
 * Represents a concrete implementation of the `IHttpClient` interface, providing methods for making HTTP requests.
 *
 * This class leverages the Fetch API for handling HTTP requests and allows for interaction with HTTP services.
 * It is configured with a base URL and request timeout upon instantiation.
 */
class HttpClient implements IHttpClient {
    private readonly timeout: number;

    /**
     * Instantiates an HttpClient object with a specified base URL and HTTP request timeout.
     *
     * @param baseURL - The base URL for all network requests.
     * @param options - (Optional) An object containing additional configuration options for the HTTP client, such as a request timeout.
     */
    constructor(
        readonly baseURL: string,
        options?: HttpClientOptions
    ) {
        this.timeout = options?.timeout ?? DEFAULT_HTTP_TIMEOUT;
    }

    /**
     * Sends an HTTP request using the Fetch API.
     *
     * @param method - The HTTP method to be used ('GET' or 'POST').
     * @param path - The path to access on the server relative to the base URL.
     * @param params - (Optional) Additional request parameters such as query parameters, request body, and custom headers.
     * @returns A promise that resolves to the response data from the HTTP request.
     * @throws {InvalidHTTPRequest}
     */
    public async http(
        method: 'GET' | 'POST',
        path: string,
        params?: HttpParams
    ): Promise<unknown> {
        let url: URL;
        try {
            url = new URL(path, this.baseURL);
        } catch (error) {
            throw new InvalidHTTPRequest(
                'HttpClient.http()',
                `Invalid URL: ${this.baseURL}${path}`,
                {
                    method,
                    url: `${this.baseURL}${path}`
                },
                error
            );
        }

        if (params?.query != null) {
            Object.entries(params.query).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }

        const config: RequestInit = {
            method,
            headers: params?.headers as HeadersInit,
            body: method !== 'GET' ? JSON.stringify(params?.body) : undefined
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, this.timeout);

        try {
            const response = await fetch(url.toString(), {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const message = await response.text();
                throw new InvalidHTTPRequest(
                    'HttpClient.http()',
                    `Request failed${message !== '' ? ` with status ${response.status} and message ${message.trimEnd()}` : ''}`,
                    {
                        method,
                        url: url.toString()
                    }
                );
            }

            this.validateResponseHeader(
                params,
                Object.fromEntries(response.headers.entries())
            );

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return await response.json();
        } catch (error) {
            if (error instanceof InvalidHTTPRequest) {
                throw error;
            }
            throw new InvalidHTTPRequest(
                'HttpClient.http()',
                'Error while validating the response header',
                {
                    method,
                    url: url.toString()
                },
                error
            );
        }
    }

    /**
     * Validates the response headers if a validation function is provided.
     *
     * @param params - (Optional) The request parameters.
     * @param headers - The response headers.
     */
    private validateResponseHeader(
        params?: HttpParams,
        headers?: Record<string, string>
    ): void {
        if (params?.validateResponseHeader != null && headers != null) {
            params.validateResponseHeader(headers);
        }
    }
}

export { HttpClient };
