/**
 * Represents the core networking interface for making HTTP requests and opening WebSocket readers.
 *
 * This interface defines methods for performing HTTP requests and opening WebSocket connections.
 * It also includes parameters and types for request options, making it a versatile networking API.
 *
 * @public
 */
interface Net {
    /**
     * The base URL
     */
    readonly baseURL: string;

    /**
     * Perform http request
     *
     * @param method - 'GET' or 'POST'
     * @param path - Path to access
     * @param params - Additional params
     * @returns The response body, JSON decoded
     */
    http: (
        method: 'GET' | 'POST',
        path: string,
        params?: NetParams
    ) => Promise<unknown>;
}

/**
 * Interface representing parameters for making HTTP requests.
 *
 * This interface defines options for configuring an HTTP request, including query parameters,
 * request body, custom headers, and a function to validate response headers.
 *
 * @public
 */
interface NetParams {
    /**
     * Query parameters to include in the request.
     */
    query: Record<string, string>;

    /**
     * The request body, which can be of any type.
     */
    body: unknown;

    /**
     * Custom headers to be included in the request.
     */
    headers: Record<string, string>;

    /**
     * A callback function to validate response headers.
     * @param headers - The response headers to validate.
     */
    validateResponseHeader: (headers: Record<string, string>) => void;
}

export type { Net, NetParams };
