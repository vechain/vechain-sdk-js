import { type WebSocketClient, type WebSocketListener } from '@thor/ws';
import type { HttpPath } from '@http';
import { ThorError, TXID } from '@thor';
import { type TXIDJSON } from '@thor/thorest/json';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/core/src/thor/subscriptions/NewTransactionSubscription.ts!';

/**
 * [Retrieve a subscription to the new transactions endpoint](http://localhost:8669/doc/stoplight-ui/#/paths/subscriptions-txpool/get)
 *
 * Retrieve a subscription to the new transactions endpoint.
 *
 * The subscription will be closed when the client disconnects.
 *
 */
class NewTransactionSubscription
    implements WebSocketClient, WebSocketListener<TXID>
{
    /**
     * Represents the path for this specific API endpoint.
     */
    private static readonly PATH: HttpPath = { path: '/subscriptions/txpool' };

    /**
     * Represents the listeners for this specific API endpoint.
     */
    private readonly listeners: Array<WebSocketListener<TXID>> = [];

    /**
     * Represents the WebSocket client for this specific API endpoint.
     */
    private readonly wsc: WebSocketClient;

    /**
     * Constructs an instance of the class with the specified WebSocket client.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     */
    protected constructor(wsc: WebSocketClient) {
        this.wsc = wsc;
    }

    /**
     * Adds a listener to the WebSocket client.
     *
     * @param {WebSocketListener<TXID>} listener - The listener to add.
     * @return {this} - The instance of the class.
     */
    addListener(listener: WebSocketListener<TXID>): this {
        this.listeners.push(listener);
        return this;
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @return {NewTransactionSubscription} - The instance of the class.
     */
    static at(wsc: WebSocketClient): NewTransactionSubscription {
        return new NewTransactionSubscription(wsc);
    }

    /**
     * Gets the base URL for the WebSocket client.
     *
     * @return {string} - The base URL for the WebSocket client.
     */
    get baseURL(): string {
        return this.wsc.baseURL;
    }

    /**
     * Closes the WebSocket client.
     *
     * @return {this} - The instance of the class.
     */
    close(): this {
        this.wsc.close();
        return this;
    }

    /**
     * Handles the close event.
     *
     * @param {Event} event - The event to handle.
     */
    onClose(event: Event): void {
        this.listeners.forEach((listener) => {
            listener.onClose(event);
        });
    }

    /**
     * Handles the error event.
     *
     * @param {Event} event - The event to handle.
     */
    onError(event: Event): void {
        this.listeners.forEach((listener) => {
            listener.onError(event);
        });
    }

    /**
     * Handles the message event.
     *
     * @param {MessageEvent<unknown>} event - The event to handle.
     */
    onMessage(event: MessageEvent<unknown>): void {
        const json = JSON.parse(event.data as string) as TXIDJSON;
        let message;
        try {
            message = new MessageEvent<TXID>(event.type, {
                data: new TXID(json)
            });
        } catch (error) {
            throw new ThorError(
                `${FQP}onMessage(event: MessageEvent<unknown>): void`,
                'Invalid JSON.',
                {
                    body: json
                },
                error instanceof Error ? error : undefined
            );
        }
        this.listeners.forEach((listener) => {
            listener.onMessage(message);
        });
    }

    /**
     * Handles the open event.
     *
     * @param {Event} event - The event to handle.
     */
    onOpen(event: Event): void {
        this.listeners.forEach((listener) => {
            listener.onOpen(event);
        });
    }

    /**
     * Opens the WebSocket client.
     *
     * @return {this} - The instance of the class.
     */
    open(): this {
        this.wsc.addListener(this).open(NewTransactionSubscription.PATH);
        return this;
    }

    /**
     * Removes a listener from the WebSocket client.
     *
     * @param {WebSocketListener<TXID>} listener - The listener to remove.
     * @return {this} - The instance of the class.
     */
    removeListener(listener: WebSocketListener<TXID>): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

export { NewTransactionSubscription };
