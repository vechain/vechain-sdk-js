import { type WebSocketClient, type WebSocketListener } from '@ws';
import type { HttpPath } from '@http';
import type { BlockId } from '@vcdm';
import {
    SubscriptionBeat2Response,
    type SubscriptionBeat2ResponseJSON
} from '@thor/subscriptions';
import { ThorError } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/subscriptions/BeatsSubscription.ts!';

/**
 * [Retrieve a subscription to the beats endpoint](http://localhost:8669/doc/stoplight-ui/#/paths/subscriptions-beat2/get)
 *
 * Retrieve a subscription to the beats endpoint.
 *
 * The subscription will be closed when the client disconnects.
 *
 */
class BeatsSubscription implements WebSocketClient, WebSocketListener<unknown> {
    /**
     * Represents the path for this specific API endpoint.
     */
    private static readonly PATH: HttpPath = { path: '/subscriptions/beat2' };

    /**
     * Represents the listeners for this specific API endpoint.
     */
    private readonly listeners: Array<
        WebSocketListener<SubscriptionBeat2Response>
    > = [];

    /**
     * Represents the query for this specific API endpoint.
     */
    private readonly query: BeatsSubscriptionQuery;

    /**
     * Represents the WebSocket client for this specific API endpoint.
     */
    private readonly wsc: WebSocketClient;

    /**
     * Constructs an instance of the class with the specified WebSocket client and query.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @param {BeatsSubscriptionQuery} query - The query to initialize the instance with.
     */
    protected constructor(wsc: WebSocketClient, query: BeatsSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    /**
     * Adds a listener to the WebSocket client.
     *
     * @param {WebSocketListener<SubscriptionBeat2Response>} listener - The listener to add.
     * @return {this} - The instance of the class.
     */
    addListener(listener: WebSocketListener<SubscriptionBeat2Response>): this {
        this.listeners.push(listener);
        return this;
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @return {BeatsSubscription} - The instance of the class.
     */
    static at(wsc: WebSocketClient): BeatsSubscription {
        return new BeatsSubscription(wsc, new BeatsSubscriptionQuery());
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
        ) as SubscriptionBeat2ResponseJSON;
        let message;
        try {
            message = new MessageEvent<SubscriptionBeat2Response>(event.type, {
                data: new SubscriptionBeat2Response(json)
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
            .open({ path: BeatsSubscription.PATH.path + this.query.query });
        return this;
    }

    /**
     * Removes a listener from the WebSocket client.
     *
     * @param {WebSocketListener<SubscriptionBeat2Response>} listener - The listener to remove.
     * @return {this} - The instance of the class.
     */
    removeListener(
        listener: WebSocketListener<SubscriptionBeat2Response>
    ): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

/**
 * Represents the query for the beats subscription.
 */
class BeatsSubscriptionQuery {
    /**
     * Represents the position for the beats subscription.
     */
    readonly pos?: BlockId;

    /**
     * Constructs an instance of the class with the specified position.
     *
     * @param {BlockId} pos - The position to initialize the instance with.
     */
    constructor(pos?: BlockId) {
        this.pos = pos;
    }

    /**
     * Gets the query for the beats subscription.
     *
     * @return {string} - The query for the beats subscription.
     */
    get query(): string {
        return this.pos === undefined ? '' : `?pos=${this.pos}`;
    }
}

export { BeatsSubscription };
