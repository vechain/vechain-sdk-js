import { type HttpPath, type HttpQuery } from '@http';
import { type Address, type BlockId } from '@vechain/sdk-core';
import { type WebSocketClient, type WebSocketListener } from '@ws';
import { type SubscriptionTransferResponse } from '@thor/subscriptions';

/**
 * [Retrieve a subscription to the transfers endpoint](http://localhost:8669/doc/stoplight-ui/#/paths/subscriptions-transfer/get)
 *
 * Retrieve a subscription to the transfers endpoint.
 *
 * The subscription will be closed when the client disconnects.
 *
 */
class TransfersSubscription
    implements WebSocketClient, WebSocketListener<SubscriptionTransferResponse>
{
    /**
     * Represents the path for this specific API endpoint.
     */
    static readonly PATH: HttpPath = { path: '/subscriptions/transfer' };

    /**
     * Represents the listeners for this specific API endpoint.
     */
    private readonly listeners: Array<
        WebSocketListener<SubscriptionTransferResponse>
    > = [];

    /**
     * Represents the query for this specific API endpoint.
     */
    private readonly query: TransfersSubscriptionQuery;

    /**
     * Represents the WebSocket client for this specific API endpoint.
     */
    private readonly wsc: WebSocketClient;

    /**
     * Constructs an instance of the class with the specified WebSocket client and query.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @param {TransfersSubscriptionQuery} query - The query to initialize the instance with.
     */
    protected constructor(
        wsc: WebSocketClient,
        query: TransfersSubscriptionQuery
    ) {
        this.wsc = wsc;
        this.query = query;
    }

    /**
     * Adds a listener to the WebSocket client.
     *
     * @param {WebSocketListener<unknown>} listener - The listener to add.
     * @return {this} - The instance of the class.
     */
    addListener(listener: WebSocketListener<unknown>): this {
        this.listeners.push(listener);
        return this;
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
     * Opens the WebSocket client.
     *
     * @return {this} - The instance of the class.
     */
    open(): this {
        this.wsc.addListener(this).open({
            path: TransfersSubscription.PATH.path + this.query.query
        });
        return this;
    }

    /**
     * Removes a listener from the WebSocket client.
     *
     * @param {WebSocketListener<unknown>} listener - The listener to remove.
     * @return {this} - The instance of the class.
     */
    removeListener(listener: WebSocketListener<unknown>): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @return {TransfersSubscription} - The instance of the class.
     */
    static at(wsc: WebSocketClient): TransfersSubscription {
        return new TransfersSubscription(wsc, new TransfersSubscriptionQuery());
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
        const json = JSON.parse(
            event.data as string
        ) as SubscriptionTransferResponse;
        const message = new MessageEvent<SubscriptionTransferResponse>(
            event.type,
            { data: json }
        );
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
}

/**
 * Query parameters for the transfers subscription endpoint.
 */
class TransfersSubscriptionQuery implements HttpQuery {
    /**
     * The block position to start from.
     */
    readonly pos?: BlockId;

    /**
     * The recipient address to filter by.
     */
    readonly recipient?: Address;

    /**
     * The sender address to filter by.
     */
    readonly sender?: Address;

    /**
     * The transaction origin address to filter by.
     */
    readonly txOrigin?: Address;

    /**
     * Constructs a new query instance with the specified parameters.
     *
     * @param {BlockId} pos - The block position to start from.
     * @param {Address} recipient - The recipient address to filter by.
     * @param {Address} sender - The sender address to filter by.
     * @param {Address} txOrigin - The transaction origin address to filter by.
     */
    constructor(
        pos?: BlockId,
        recipient?: Address,
        sender?: Address,
        txOrigin?: Address
    ) {
        this.pos = pos;
        this.recipient = recipient;
        this.sender = sender;
        this.txOrigin = txOrigin;
    }

    /**
     * Gets the query string representation.
     *
     * @return {string} - The query string.
     */
    get query(): string {
        let query = '';
        if (this.pos !== undefined) {
            query += `pos=${this.pos}`;
        }
        if (this.recipient !== undefined) {
            if (query.length > 0) query += '&';
            query += `recipient=${this.recipient}`;
        }
        if (this.sender !== undefined) {
            if (query.length > 0) query += '&';
            query += `sender=${this.sender}`;
        }
        if (this.txOrigin !== undefined) {
            if (query.length > 0) query += '&';
            query += `txOrigin=${this.txOrigin}`;
        }
        return query.length > 0 ? `?${query}` : query;
    }
}

export { TransfersSubscription };
