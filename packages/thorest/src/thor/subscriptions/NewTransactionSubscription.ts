import { type WebSocketClient, type WebSocketListener } from '@ws';
import type { HttpPath } from '@http';
import { TXID, type TXIDJSON } from '@thor/transactions';

class NewTransactionSubscription
    implements WebSocketClient, WebSocketListener<TXID>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/txpool' };

    private readonly listeners: Array<WebSocketListener<TXID>> = [];

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient) {
        this.wsc = wsc;
    }

    addListener(listener: WebSocketListener<TXID>): this {
        this.listeners.push(listener);
        return this;
    }

    static at(wsc: WebSocketClient): NewTransactionSubscription {
        return new NewTransactionSubscription(wsc);
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
        const json = JSON.parse(event.data as string) as TXIDJSON;
        const message = new MessageEvent<TXID>(event.type, {
            data: new TXID(json)
        });
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
        this.wsc.addListener(this).open(NewTransactionSubscription.PATH);
        return this;
    }

    removeListener(listener: WebSocketListener<TXID>): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

export { NewTransactionSubscription };
