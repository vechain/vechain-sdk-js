import WebSocket from 'isomorphic-ws';
import { type NetWebSocketReader } from './interfaces';

/**
 * A concrete implementation of the `Net.WebSocketReader` interface for reading data from a WebSocket connection.
 *
 * This class establishes a WebSocket connection, listens for incoming messages, and provides a mechanism to read data.
 *
 * @public
 */
export class SimpleWebSocketReader implements NetWebSocketReader {
    // The WebSocket connection used for communication.
    private readonly ws: WebSocket;

    // Callbacks to handle incoming data and potential errors.
    private callbacks = [] as Array<(data: unknown, error?: Error) => void>;

    // An optional error that can be set if an error occurs during WebSocket operations.
    private error?: Error;

    /**
     * Creates a new `SimpleWebSocketReader` instance for the specified URL and timeout.
     *
     * @param url - The WebSocket URL to connect to.
     * @param timeout - The timeout for reading data from the WebSocket (default: 30 seconds).
     */
    constructor(
        url: string,
        private readonly timeout = 30 * 1000
    ) {
        // Establish a WebSocket connection.
        this.ws = new WebSocket(url);

        // Define WebSocket event handlers.
        this.ws.onmessage = (ev: WebSocket.MessageEvent) => {
            try {
                const cbs = this.callbacks;
                this.callbacks = [];
                cbs.forEach((cb) => {
                    cb(ev.data);
                });
            } catch (err) {
                this.setError(err as Error);
                this.ws.close();
            }
        };
        this.ws.onerror = () => {
            this.ws.close();
        };
        this.ws.onclose = () => {
            this.setError(new Error('closed'));
        };
    }

    /**
     * Read data from the WebSocket connection.
     *
     * @returns A promise that resolves with the data read from the WebSocket.
     */
    public async read(): Promise<unknown> {
        return await new Promise<unknown>((resolve, reject) => {
            if (this.error !== undefined) {
                reject(this.error);
                return;
            }

            const timer = setTimeout(() => {
                reject(new Error('ws read timeout'));
            }, this.timeout);

            this.callbacks.push((data, err) => {
                clearTimeout(timer);
                if (err !== undefined) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    /**
     * Close the WebSocket connection.
     */
    public close(): void {
        this.ws.close();
    }

    /**
     * Set the internal error state and trigger error callbacks.
     *
     * This method is used to set an error state, close the WebSocket connection, and inform any pending read
     * operations about the error.
     *
     * @param err - The error that occurred.
     */
    private setError(err: Error): void {
        // If an error is already set, ignore the new error and only trigger callbacks.
        if (this.error != null) {
            this.error = err;

            // Trigger error callbacks with the provided error.
            const cbs = this.callbacks;
            this.callbacks = [];
            cbs.forEach((cb) => {
                cb(null, err);
            });
        }
    }
}
