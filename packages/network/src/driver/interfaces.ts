/**
 * Represents the core networking interface for making HTTP requests and opening WebSocket readers.
 *
 * This interface defines methods for performing HTTP requests and opening WebSocket connections.
 * It also includes parameters and types for request options, making it a versatile networking API.
 *
 * @public
 */
export interface Net {
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
        params?: Net.Params
    ) => Promise<unknown>;

    /**
     * Opens a WebSocket reader for the specified path.
     *
     * @param path - The path to open a WebSocket connection.
     * @returns The WebSocket reader instance for the provided path.
     */
    openWebSocketReader: (path: string) => Net.WebSocketReader;
}

/**
 * The `Net` namespace contains interfaces and definitions related to network communication.
 * It includes the `Params` interface for configuring HTTP requests and the `WebSocketReader`
 * interface for reading data from WebSocket connections.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Net {
    /**
     * Interface representing parameters for making HTTP requests.
     *
     * This interface defines options for configuring an HTTP request, including query parameters,
     * request body, custom headers, and a function to validate response headers.
     *
     * @public
     */
    interface Params {
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
     * Interface representing a WebSocket reader.
     * WebSocket readers allow you to read data from a WebSocket connection.
     *
     * @public
     */
    interface WebSocketReader {
        /**
         * Read data from the WebSocket connection.
         *
         * @returns A promise that resolves with the data read from the WebSocket.
         */
        read: () => Promise<unknown>;

        /**
         * Close the WebSocket reader and terminate the connection.
         */
        close: () => void;
    }
}
