import { type WebSocketClient, type WebSocketListener } from '../../ws';
import type { HttpPath } from '../../http';
import type { BlockId } from '@vechain/sdk-core';
import { type SubscriptionBeat2ResponseJSON } from './SubscriptionBeat2Response';

class BeatsSubscription implements WebSocketClient, WebSocketListener<unknown> {
    static readonly PATH: HttpPath = { path: '/subscriptions/beat2' };

    private readonly messageListeners: Array<
        WebSocketListener<SubscriptionBeat2ResponseJSON>
    > = [];

    private readonly query: BeatsSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient, query: BeatsSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    addMessageListener(
        listener: WebSocketListener<SubscriptionBeat2ResponseJSON>
    ): this {
        this.messageListeners.push(listener);
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

    onMessage(event: MessageEvent<unknown>): void {
        const json = JSON.parse(
            event.data as string
        ) as SubscriptionBeat2ResponseJSON;
        const message = new MessageEvent<SubscriptionBeat2ResponseJSON>(
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
            .open({ path: BeatsSubscription.PATH.path + this.query.query });
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
