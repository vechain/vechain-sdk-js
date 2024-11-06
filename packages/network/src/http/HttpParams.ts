/**
 * Represents the parameters for making an HTTP request.
 *
 * This interface specifies options for configuring an HTTP request,
 * including query parameters, request body, custom headers,
 * and a function to validate response headers.
 */
export interface HttpParams {
    /**
     * The request body, which can be of any type.
     */
    body?: unknown;

    /**
     * Custom headers to be included in the request.
     */
    headers?: Record<string, string>;

    /**
     * Query parameters to include in the request.
     */
    query?: Record<string, string>;

    /**
     * A callback function to validate response headers.
     * @param headers - The response headers to validate.
     */
    validateResponseHeader?: (headers: Record<string, string>) => void;
}
