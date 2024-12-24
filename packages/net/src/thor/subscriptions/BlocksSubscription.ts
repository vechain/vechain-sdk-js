import { type HttpPath, type HttpQuery } from '../../http';
import { type WebSocketClient, type WebSocketListener } from '../../ws';
import {
    SubscriptionBlockResponse,
    type SubscriptionBlockResponseJSON
} from './SubscriptionBlockResponse';
import { type BlockId } from '@vechain/sdk-core';

class BlocksSubscription
    implements WebSocketClient, WebSocketListener<unknown>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/block' };

    private readonly messageListeners: Array<
        WebSocketListener<SubscriptionBlockResponse>
    > = [];

    private readonly query: BlockSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient, query: BlockSubscriptionQuery) {
        this.wsc = wsc;
        this.query = query;
    }

    addMessageListener(
        listener: WebSocketListener<SubscriptionBlockResponse>
    ): this {
        this.messageListeners.push(listener);
        return this;
    }

    static at(wsc: WebSocketClient): BlocksSubscription {
        return new BlocksSubscription(wsc, new BlockSubscriptionQuery());
    }

    atPos(pos: BlockId): BlocksSubscription {
        return new BlocksSubscription(
            this.wsc,
            new BlockSubscriptionQuery(pos)
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
        ) as SubscriptionBlockResponseJSON;
        const message = new MessageEvent<SubscriptionBlockResponse>(
            event.type,
            { data: new SubscriptionBlockResponse(json) }
        );
        this.messageListeners.forEach((listener) => {
            listener.onMessage(message);
        });
    }

    open(path: HttpPath = BlocksSubscription.PATH): this {
        this.wsc.addMessageListener(this).open(path);
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
