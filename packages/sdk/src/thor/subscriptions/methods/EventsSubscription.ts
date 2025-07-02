import { type WebSocketClient, type WebSocketListener } from '@ws';
import { type SubscriptionEventResponse } from '@thor/subscriptions';
import { type HttpPath, type HttpQuery } from '@http';
import { type Address, type ThorId } from '@vcdm';
import { ThorError } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/subscriptions/EventsSubscription.ts!';

/**
 * [Retrieve a subscription to the events endpoint](http://localhost:8669/doc/stoplight-ui/#/paths/subscriptions-event/get)
 *
 * Retrieve a subscription to the events endpoint.
 *
 * The subscription will be closed when the client disconnects.
 *
 */
class EventsSubscription
    implements WebSocketClient, WebSocketListener<SubscriptionEventResponse>
{
    /**
     * Represents the path for this specific API endpoint.
     */
    private static readonly PATH: HttpPath = { path: '/subscriptions/event' };

    /**
     * Represents the listeners for this specific API endpoint.
     */
    private readonly listeners: Array<
        WebSocketListener<SubscriptionEventResponse>
    > = [];

    /**
     * Represents the query for this specific API endpoint.
     */
    private readonly query: EventsSubscriptionQuery;

    /**
     * Represents the WebSocket client for this specific API endpoint.
     */
    private readonly wsc: WebSocketClient;

    /**
     * Constructs an instance of the class with the specified WebSocket client and query.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @param {EventsSubscriptionQuery} query - The query to initialize the instance with.
     */
    protected constructor(
        wsc: WebSocketClient,
        query: EventsSubscriptionQuery
    ) {
        this.wsc = wsc;
        this.query = query;
    }

    /**
     * Adds a listener to the WebSocket client.
     *
     * @param {WebSocketListener<SubscriptionEventResponse>} listener - The listener to add.
     * @return {this} - The instance of the class.
     */
    addListener(listener: WebSocketListener<SubscriptionEventResponse>): this {
        this.listeners.push(listener);
        return this;
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @return {EventsSubscription} - The instance of the class.
     */
    static at(wsc: WebSocketClient): EventsSubscription {
        return new EventsSubscription(wsc, new EventsSubscriptionQuery());
    }

    /**
     * Creates a new instance of the class with the specified WebSocket client and query.
     *
     * @param {WebSocketClient} wsc - The WebSocket client to initialize the instance with.
     * @param {EventsSubscriptionQuery} query - The query to initialize the instance with.
     */
    atPos(pos?: ThorId): EventsSubscription {
        return new EventsSubscription(
            this.wsc,
            new EventsSubscriptionQuery(
                this.query.addr,
                pos ?? this.query.pos,
                this.query.t0,
                this.query.t1,
                this.query.t2,
                this.query.t3
            )
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
        ) as SubscriptionEventResponse;
        let message;
        try {
            message = new MessageEvent<SubscriptionEventResponse>(event.type, {
                data: json
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
            .open({ path: EventsSubscription.PATH.path + this.query.query });
        return this;
    }

    /**
     * Removes a listener from the WebSocket client.
     *
     * @param {WebSocketListener<SubscriptionEventResponse>} listener - The listener to remove.
     * @return {this} - The instance of the class.
     */
    removeListener(
        listener: WebSocketListener<SubscriptionEventResponse>
    ): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }

    /**
     * Creates a new instance of the class with the specified contract address.
     *
     * @param {Address} contractAddress - The contract address to initialize the instance with.
     * @return {EventsSubscription} - The instance of the class.
     */
    withContractAddress(contractAddress?: Address): EventsSubscription {
        return new EventsSubscription(
            this.wsc,
            new EventsSubscriptionQuery(
                contractAddress ?? this.query.addr,
                this.query.pos,
                this.query.t0,
                this.query.t1,
                this.query.t2,
                this.query.t3
            )
        );
    }

    /**
     * Creates a new instance of the class with the specified filters.
     *
     * @param {ThorId} t0 - The filter for the 1st parameter.
     * @param {ThorId} t1 - The filter for the 2nd parameter.
     * @param {ThorId} t2 - The filter for the 3rd parameter.
     * @param {ThorId} t3 - The filter for the 4th parameter.
     * @return {EventsSubscription} - The instance of the class.
     */
    withFilters(
        t0?: ThorId,
        t1?: ThorId,
        t2?: ThorId,
        t3?: ThorId
    ): EventsSubscription {
        return new EventsSubscription(
            this.wsc,
            new EventsSubscriptionQuery(
                this.query.addr,
                this.query.pos,
                t0 ?? this.query.t0,
                t1 ?? this.query.t1,
                t2 ?? this.query.t2,
                t3 ?? this.query.t3
            )
        );
    }
}

/**
 * A subscription to events emitted by smart contracts on the VeChain blockchain.
 *
 * This class allows subscribing to events from a specific contract address and filtering them based on:
 * - Event signature (t0)
 * - Up to 3 indexed parameters (t1, t2, t3)
 * - Starting block position (pos)
 *
 * The subscription will receive real-time updates when matching events are emitted.
 */
class EventsSubscriptionQuery implements HttpQuery {
    /**
     * The address of the contract that emits the event.
     */
    readonly addr?: Address;
    /**
     * A saved block ID for resuming the subscription. If omitted, the best block ID is assumed.
     */
    readonly pos?: ThorId;
    /**
     * The keccak256 hash representing the event signature
     */
    readonly t0?: ThorId;
    /**
     * Filters events based on the 1st parameter in the event
     */
    readonly t1?: ThorId;
    /**
     * Filters events based on the 2nd parameter in the event
     */
    readonly t2?: ThorId;
    /**
     * Filters events based on the 3rd parameter in the event
     */
    readonly t3?: ThorId;

    /**
     * Constructs an instance of the class with the specified filters.
     *
     * @param {Address} addr - The address of the contract that emits the event.
     * @param {ThorId} pos - A saved block ID for resuming the subscription. If omitted, the best block ID is assumed.
     * @param {ThorId} t0 - The keccak256 hash representing the event signature
     * @param {ThorId} t1 - The filter for the 1st parameter in the event
     * @param {ThorId} t2 - The filter for the 2nd parameter in the event
     * @param {ThorId} t3 - The filter for the 3rd parameter in the event
     */
    constructor(
        addr?: Address,
        pos?: ThorId,
        t0?: ThorId,
        t1?: ThorId,
        t2?: ThorId,
        t3?: ThorId
    ) {
        this.addr = addr;
        this.pos = pos;
        this.t0 = t0;
        this.t1 = t1;
        this.t2 = t2;
        this.t3 = t3;
    }

    /**
     * Gets the query for the events subscription.
     *
     * @return {string} - The query for the events subscription.
     */
    get query(): string {
        let query = '';
        if (this.addr !== undefined) {
            query += `addr=${this.addr}`;
        }
        if (this.pos !== undefined) {
            if (query.length > 0) query += '&';
            query += `pos=${this.pos}`;
        }
        if (this.t0 !== undefined) {
            if (query.length > 0) query += '&';
            query += `t0=${this.t0}`;
        }
        if (this.t1 !== undefined) {
            if (query.length > 0) query += '&';
            query += `t1=${this.t1}`;
        }
        if (this.t2 !== undefined) {
            if (query.length > 0) query += '&';
            query += `t2=${this.t2}`;
        }
        if (this.t3 !== undefined) {
            if (query.length > 0) query += '&';
            query += `t3=${this.t3}`;
        }
        return query.length > 0 ? `?${query}` : query;
    }
}

export { EventsSubscription };
