/**
 * Represents the parameters for making an HTTP request.
 *
 * This interface specifies options for configuring an HTTP request, including query parameters,
 * request body, custom headers, and a function to validate response headers.
 */
interface HttpParams {
    /**
     * Query parameters to include in the request.
     */
    query?: Record<string, string>;

    /**
     * The request body, which can be of any type.
     */
    body?: unknown;

    /**
     * Custom headers to be included in the request.
     */
    headers?: Record<string, string>;

    /**
     * A callback function to validate response headers.
     * @param headers - The response headers to validate.
     */
    validateResponseHeader?: (headers: Record<string, string>) => void;
}

/**
 * Represents the options for configuring an HTTP client.
 */
interface HttpClientOptions {
    /**
     * The timeout for an HTTP request, in milliseconds.
     */
    timeout?: number;
}

/**
 * Represents an HTTP client that provides methods for making HTTP requests.
 */
interface IHttpClient {
    http: (
        method: 'GET' | 'POST',
        path: string,
        params?: HttpParams
    ) => Promise<unknown>;

    baseURL: string;
}

export type { HttpParams, HttpClientOptions, IHttpClient };
