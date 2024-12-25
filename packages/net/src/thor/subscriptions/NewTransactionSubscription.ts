import { type WebSocketClient, type WebSocketListener } from '../../ws';
import type { HttpPath } from '../../http';
import { TXID, type TXIDJSON } from './TXID';

class NewTransactionSubscription
    implements WebSocketClient, WebSocketListener<TXID>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/txpool' };

    private readonly messageListeners: Array<WebSocketListener<TXID>> = [];

    private readonly wsc: WebSocketClient;

    protected constructor(wsc: WebSocketClient) {
        this.wsc = wsc;
    }

    addMessageListener(listener: WebSocketListener<TXID>): this {
        this.messageListeners.push(listener);
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

    onMessage(event: MessageEvent<unknown>): void {
        const json = JSON.parse(event.data as string) as TXIDJSON;
        const message = new MessageEvent<TXID>(event.type, {
            data: new TXID(json)
        });
        this.messageListeners.forEach((listener) => {
            listener.onMessage(message);
        });
    }

    open(): this {
        this.wsc.addMessageListener(this).open(NewTransactionSubscription.PATH);
        return this;
    }
}

export { NewTransactionSubscription };
