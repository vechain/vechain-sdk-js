import { type HttpPath } from '../../http';
import { type WebSocketClient, type WebSocketListener } from '../../ws';
import {
    SubscriptionBlockResponse,
    type SubscriptionBlockResponseJSON
} from './SubscriptionBlockResponse';

class BlocksSubscription
    implements WebSocketClient, WebSocketListener<unknown>
{
    static readonly PATH: HttpPath = { path: '/subscriptions/block' };

    private readonly messageListeners: Array<
        WebSocketListener<SubscriptionBlockResponse>
    > = [];

    private readonly wsc: WebSocketClient;

    constructor(wsc: WebSocketClient) {
        this.wsc = wsc;
    }

    addMessageListener(
        listener: WebSocketListener<SubscriptionBlockResponse>
    ): this {
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

export { BlocksSubscription };
