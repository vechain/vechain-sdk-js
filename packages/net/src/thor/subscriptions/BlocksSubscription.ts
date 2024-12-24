import { type HttpPath } from '../../http';
import { type WebSocketClient, type WebSocketListener } from '../../ws';

class BlocksSubscription
    implements WebSocketClient, WebSocketListener<unknown>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/block' };

    private readonly messageListeners: Array<WebSocketListener<unknown>> = [];

    private readonly wsc: WebSocketClient;

    constructor(wsc: WebSocketClient) {
        this.wsc = wsc;
    }

    addMessageListener(listener: WebSocketListener<unknown>): this {
        this.messageListeners.push(listener);
        return this;
    }

    get baseURL(): string {
        return this.wsc.baseURL;
    }

    close(): this {
        this.wsc.close();
        return this;
    }

    onMessage(event: MessageEvent<unknown>): void {
        this.messageListeners.forEach((listener) => {
            listener.onMessage(event);
        });
    }

    open(path: HttpPath = BlocksSubscription.PATH): this {
        this.wsc.addMessageListener(this).open(path);
        return this;
    }
}

export { BlocksSubscription };
