import { type WebSocketClient, type WebSocketListener } from '@ws';
import type { HttpPath } from '@http';
import type { BlockId } from '@vechain/sdk-core';
import {
    SubscriptionBeat2Response
} from '@thor/subscriptions';
import { type SubscriptionBeat2ResponseJSON } from './SubscriptionBeat2ResponseJSON';

class BeatsSubscription implements WebSocketClient, WebSocketListener<unknown> {
    static readonly PATH: HttpPath = { path: '/subscriptions/beat2' };

    private readonly listeners: Array<
        WebSocketListener<SubscriptionBeat2Response>
    > = [];

    private readonly query: BeatsSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient, query: BeatsSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    addListener(listener: WebSocketListener<SubscriptionBeat2Response>): this {
        this.listeners.push(listener);
        return this;
    }

    static at(wsc: WebSocketClient): BeatsSubscription {
        return new BeatsSubscription(wsc, new BeatsSubscriptionQuery());
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
        ) as SubscriptionBeat2ResponseJSON;
        const message = new MessageEvent<SubscriptionBeat2Response>(
            event.type,
            { data: new SubscriptionBeat2Response(json) }
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
            .open({ path: BeatsSubscription.PATH.path + this.query.query });
        return this;
    }

    removeListener(
        listener: WebSocketListener<SubscriptionBeat2Response>
    ): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

class BeatsSubscriptionQuery {
    readonly pos?: BlockId;

    constructor(pos?: BlockId) {
        this.pos = pos;
    }

    get query(): string {
        return this.pos === undefined ? '' : `?pos=${this.pos}`;
    }
}

export { BeatsSubscription };
