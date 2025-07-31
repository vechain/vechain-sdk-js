import { type HttpPath, type HttpQuery } from '@http';
import { type WebSocketClient, type WebSocketListener } from '@thor/ws';
import {
    SubscriptionBlockResponse,
    type SubscriptionBlockResponseJSON
} from '@thor/subscriptions';
import { type Hex } from '@common/vcdm';
import { ThorError } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/subscriptions/BlocksSubscription.ts!';

/**
 * [Retrieve a subscription to the blocks endpoint](http://localhost:8669/doc/stoplight-ui/#/paths/subscriptions-block/get)
 *
 * Retrieve a subscription to the blocks endpoint.
 *
 * The subscription will be closed when the client disconnects.
 *
 */
class BlocksSubscription
    implements WebSocketClient, WebSocketListener<unknown>
{
    /**
     * Represents the path for this specific API endpoint.
     */
    private static readonly PATH: HttpPath = { path: '/subscriptions/block' };

    /**
     * Represents the listeners for this specific API endpoint.
     */
    private readonly listeners: Array<
        WebSocketListener<SubscriptionBlockResponse>
    > = [];

    /**
     * Represents the query for this specific API endpoint.
     */
    private readonly query: BlockSubscriptionQuery;

    /**
     * Represents the WebSocket client for this specific API endpoint.
     */
    private readonly wsc: WebSocketClient;

    /**
     * Constructs an instance of the class with the specified WebSocket client and query.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @param {BlockSubscriptionQuery} query - The query to initialize the instance with.
     */
    protected constructor(wsc: WebSocketClient, query: BlockSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    /**
     * Adds a listener to the WebSocket client.
     *
     * @param {WebSocketListener<SubscriptionBlockResponse>} listener - The listener to add.
     * @return {this} - The instance of the class.
     */
    addListener(listener: WebSocketListener<SubscriptionBlockResponse>): this {
        this.listeners.push(listener);
        return this;
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @return {BlocksSubscription} - The instance of the class.
     */
    static at(wsc: WebSocketClient): BlocksSubscription {
        return new BlocksSubscription(wsc, new BlockSubscriptionQuery());
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client and query.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @param {BlockSubscriptionQuery} query - The query to initialize the instance with.
     */
    atPos(pos?: Hex): BlocksSubscription {
        return new BlocksSubscription(
            this.wsc,
            new BlockSubscriptionQuery(pos ?? this.query.pos)
        );
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
     *
     * @throws {ThorError} - If the JSON is invalid.
     */
    onMessage(event: MessageEvent<unknown>): void {
        const json = JSON.parse(
            event.data as string
        ) as SubscriptionBlockResponseJSON;
        let message;
        try {
            message = new MessageEvent<SubscriptionBlockResponse>(event.type, {
                data: new SubscriptionBlockResponse(json)
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
        this.wsc
            .addListener(this)
            .open({ path: BlocksSubscription.PATH.path + this.query.query });
        return this;
    }

    /**
     * Removes a listener from the WebSocket client.
     *
     * @param {WebSocketListener<SubscriptionBlockResponse>} listener - The listener to remove.
     * @return {this} - The instance of the class.
     */
    removeListener(
        listener: WebSocketListener<SubscriptionBlockResponse>
    ): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

/**
 * Represents the query for the blocks subscription.
 */
class BlockSubscriptionQuery implements HttpQuery {
    /**
     * Represents the position for the blocks subscription.
     */
    readonly pos?: Hex;

    /**
     * Constructs an instance of the class with the specified position.
     *
     * @param {Hex} pos - The position to initialize the instance with.
     */
    constructor(pos?: Hex) {
        this.pos = pos;
    }

    /**
     * Gets the query for the blocks subscription.
     *
     * @return {string} - The query for the blocks subscription.
     */
    get query(): string {
        return this.pos === undefined ? '' : `?pos=${this.pos}`;
    }
}

export { BlocksSubscription };
