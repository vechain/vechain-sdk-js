import { type WebSocketClient, type WebSocketListener } from '../../ws';
import { type SubscriptionEventResponse } from './SubscriptionEventResponse';
import { type HttpPath, type HttpQuery } from '../../http';
import { type Address, type ThorId } from '@vechain/sdk-core';

class EventsSubscription
    implements WebSocketClient, WebSocketListener<SubscriptionEventResponse>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/event' };

    private readonly messageListeners: Array<
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

    addMessageListener(
        listener: WebSocketListener<SubscriptionEventResponse>
    ): this {
        this.messageListeners.push(listener);
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

    onMessage(event: MessageEvent<unknown>): void {
        const json = JSON.parse(
            event.data as string
        ) as SubscriptionEventResponse;
        const message = new MessageEvent<SubscriptionEventResponse>(
            event.type,
            { data: json }
        );
        this.messageListeners.forEach((listener) => {
            listener.onMessage(message);
        });
    }

    open(): this {
        this.wsc
            .addMessageListener(this)
            .open({ path: EventsSubscription.PATH.path + this.query.query });
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

class EventsSubscriptionQuery implements HttpQuery {
    readonly addr?: Address;
    readonly pos?: ThorId;
    readonly t0?: ThorId;
    readonly t1?: ThorId;
    readonly t2?: ThorId;
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
