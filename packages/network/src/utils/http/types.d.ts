import { type AxiosInstance } from 'axios';

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

    /**
     * An Axios instance to use for sending HTTP requests.
     * This is useful for customizing the HTTP client, such as adding a custom user agent.
     */
    axiosInstance?: AxiosInstance;
}

export type { HttpParams, HttpClientOptions };
