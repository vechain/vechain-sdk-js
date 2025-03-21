import { type WebSocketClient, type WebSocketListener } from '../../ws';
import { type SubscriptionEventResponse } from './SubscriptionEventResponse';
import { type HttpPath, type HttpQuery } from '../../http';
import { type Address, type ThorId } from '@vechain/sdk-core';

class EventsSubscription
    implements WebSocketClient, WebSocketListener<SubscriptionEventResponse>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/event' };

    private readonly listeners: Array<
        WebSocketListener<SubscriptionEventResponse>
    > = [];

    private readonly query: EventsSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(
        wsc: WebSocketClient,
        query: EventsSubscriptionQuery
    ) {
        this.wsc = wsc;
        this.query = query;
    }

    addListener(listener: WebSocketListener<SubscriptionEventResponse>): this {
        this.listeners.push(listener);
        return this;
    }

    static at(wsc: WebSocketClient): EventsSubscription {
        return new EventsSubscription(wsc, new EventsSubscriptionQuery());
    }

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

    get baseURL(): string {
        return this.wsc.baseURL;
    }

    close(): this {
        this.wsc.close();
        return this;
    }

    onClose(event: Event): void {
        this.listeners.forEach((listener) => {
            listener.onClose(event);
        });
    }

    onError(event: Event): void {
        this.listeners.forEach((listener) => {
            listener.onError(event);
        });
    }

    onMessage(event: MessageEvent<unknown>): void {
        const json = JSON.parse(
            event.data as string
        ) as SubscriptionEventResponse;
        const message = new MessageEvent<SubscriptionEventResponse>(
            event.type,
            { data: json }
        );
        this.listeners.forEach((listener) => {
            listener.onMessage(message);
        });
    }

    onOpen(event: Event): void {
        this.listeners.forEach((listener) => {
            listener.onOpen(event);
        });
    }

    open(): this {
        this.wsc
            .addListener(this)
            .open({ path: EventsSubscription.PATH.path + this.query.query });
        return this;
    }

    removeListener(
        listener: WebSocketListener<SubscriptionEventResponse>
    ): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }

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
