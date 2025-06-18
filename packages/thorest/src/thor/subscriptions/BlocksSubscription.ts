import { type HttpPath, type HttpQuery } from '@http';
import { type WebSocketClient, type WebSocketListener } from '@ws';
import {
    SubscriptionBlockResponse
} from '@thor/subscriptions';
import { type BlockId } from '@vechain/sdk-core';
import { type SubscriptionBlockResponseJSON } from './SubscriptionBlockResponseJSON';

class BlocksSubscription
    implements WebSocketClient, WebSocketListener<unknown>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/block' };

    private readonly listeners: Array<
        WebSocketListener<SubscriptionBlockResponse>
    > = [];

    private readonly query: BlockSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient, query: BlockSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    addListener(listener: WebSocketListener<SubscriptionBlockResponse>): this {
        this.listeners.push(listener);
        return this;
    }

    static at(wsc: WebSocketClient): BlocksSubscription {
        return new BlocksSubscription(wsc, new BlockSubscriptionQuery());
    }

    atPos(pos?: BlockId): BlocksSubscription {
        return new BlocksSubscription(
            this.wsc,
            new BlockSubscriptionQuery(pos ?? this.query.pos)
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
        ) as SubscriptionBlockResponseJSON;
        const message = new MessageEvent<SubscriptionBlockResponse>(
            event.type,
            { data: new SubscriptionBlockResponse(json) }
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
            .open({ path: BlocksSubscription.PATH.path + this.query.query });
        return this;
    }

    removeListener(
        listener: WebSocketListener<SubscriptionBlockResponse>
    ): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

class BlockSubscriptionQuery implements HttpQuery {
    readonly pos?: BlockId;

    constructor(pos?: BlockId) {
        this.pos = pos;
    }

    get query(): string {
        return this.pos === undefined ? '' : `?pos=${this.pos}`;
    }
}

export { BlocksSubscription };
