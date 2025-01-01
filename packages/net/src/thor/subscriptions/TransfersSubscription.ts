import { type HttpPath, type HttpQuery } from '../../http';
import { type Address, type BlockId } from '@vechain/sdk-core';
import { type WebSocketClient, type WebSocketListener } from '../../ws';
import { type SubscriptionTransferResponse } from './SubscriptionTransferResponse';

class TransfersSubscription
    implements WebSocketClient, WebSocketListener<SubscriptionTransferResponse>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/transfer' };

    private readonly listeners: Array<
        WebSocketListener<SubscriptionTransferResponse>
    > = [];

    private readonly query: TransfersSubscriptionQuery;

    private readonly wsc: WebSocketClient;

    protected constructor(
        wsc: WebSocketClient,
        query: TransfersSubscriptionQuery
    ) {
        this.wsc = wsc;
        this.query = query;
    }

    addListener(listener: WebSocketListener<unknown>): WebSocketClient {
        this.listeners.push(listener);
        return this;
    }

    close(): WebSocketClient {
        this.wsc.close();
        return this;
    }

    open(): WebSocketClient {
        this.wsc.addListener(this).open({
            path: TransfersSubscription.PATH.path + this.query.query
        });
        return this;
    }

    removeListener(listener: WebSocketListener<unknown>): WebSocketClient {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }

    static at(wsc: WebSocketClient): TransfersSubscription {
        return new TransfersSubscription(wsc, new TransfersSubscriptionQuery());
    }

    get baseURL(): string {
        return this.wsc.baseURL;
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
        ) as SubscriptionTransferResponse;
        const message = new MessageEvent<SubscriptionTransferResponse>(
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
}

class TransfersSubscriptionQuery implements HttpQuery {
    readonly pos?: BlockId;
    readonly recipient?: Address;
    readonly sender?: Address;
    readonly txOrigin?: Address;

    constructor(
        pos?: BlockId,
        recipient?: Address,
        sender?: Address,
        txOrigin?: Address
    ) {
        this.pos = pos;
        this.recipient = recipient;
        this.sender = sender;
        this.txOrigin = txOrigin;
    }

    get query(): string {
        let query = '';
        if (this.pos !== undefined) {
            query += `pos=${this.pos}`;
        }
        if (this.recipient !== undefined) {
            if (query.length > 0) query += '&';
            query += `recipient=${this.recipient}`;
        }
        if (this.sender !== undefined) {
            if (query.length > 0) query += '&';
            query += `sender=${this.sender}`;
        }
        if (this.txOrigin !== undefined) {
            if (query.length > 0) query += '&';
            query += `txOrigin=${this.txOrigin}`;
        }
        return query.length > 0 ? `?${query}` : query;
    }
}

export { TransfersSubscription };
