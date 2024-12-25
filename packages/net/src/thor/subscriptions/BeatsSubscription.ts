import { type WebSocketClient, type WebSocketListener } from '../../ws';
import type { HttpPath } from '../../http';
import type { BlockId } from '@vechain/sdk-core';
import {
    SubscriptionBeat2Response,
    type SubscriptionBeat2ResponseJSON
} from './SubscriptionBeat2Response';

class BeatsSubscription implements WebSocketClient, WebSocketListener<unknown> {
    static readonly PATH: HttpPath = { path: '/subscriptions/beat2' };

    private readonly messageListeners: Array<
        WebSocketListener<SubscriptionBeat2Response>
    > = [];

    private readonly query: BeatsSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient, query: BeatsSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    addMessageListener(
        listener: WebSocketListener<SubscriptionBeat2Response>
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
        const message = new MessageEvent<SubscriptionBeat2Response>(
            event.type,
            { data: new SubscriptionBeat2Response(json) }
        );
        this.messageListeners.forEach((listener) => {
            listener.onMessage(message);
        });
    }

    open(path: HttpPath = BeatsSubscription.PATH): this {
        this.wsc.addMessageListener(this).open(path);
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
