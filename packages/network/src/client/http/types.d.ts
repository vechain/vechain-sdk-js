import { type AxiosInstance } from 'axios';

/**
 * Represents the core networking interface for executing HTTP requests.
 *
 * This interface encapsulates methods for sending HTTP requests. It also outlines the structure for request parameters,
 * making it a foundational networking API.
 *
 * @public
 */
interface IHttpClient {
    /**
     * The base URL for all network requests.
     */
    readonly baseURL: string;

    /**
     * Performs an HTTP request.
     *
     * @param method - Specifies the HTTP method to use, either 'GET' or 'POST'.
     * @param path - Specifies the path to access on the server, relative to the baseURL.
     * @param params - (Optional) Additional parameters for the request.
     * @returns A promise resolving to the response body, JSON decoded.
     */
    http: (
        method: 'GET' | 'POST',
        path: string,
        params?: NetParams
    ) => Promise<unknown>;
}

/**
 * Represents the parameters for making an HTTP request.
 *
 * This interface specifies options for configuring an HTTP request, including query parameters,
 * request body, custom headers, and a function to validate response headers.
 *
 * @public
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
 * @public
 */
interface HttpClientOptions {
    /**
     * The timeout for an HTTP request, in milliseconds.
     */
    timeout?: number;

    /**
     * An Axios instance to use for sending HTTP requests.
     * This is useful for customizing the HTTP client, such as adding a custom user agent.
     */
    axiosInstance?: AxiosInstance;
}

export type { IHttpClient, HttpParams, HttpClientOptions };
