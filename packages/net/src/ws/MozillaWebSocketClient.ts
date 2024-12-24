import { type WebSocketClient } from './WebSocketClient';
import { type WebSocketListener } from './WebSocketListener';

class MozillaWebSocketClient implements WebSocketClient {
    private ws?: WebSocket;

    private readonly messageListeners: Array<WebSocketListener<unknown>> = [];

    addMessageListener(listener: WebSocketListener<unknown>): this {
        this.messageListeners.push(listener);
        return this;
    }

    close(): WebSocketClient {
        this.ws?.close();
        this.ws = undefined;
        return this;
    }

    open(url: string): WebSocketClient {
        this.close();
        this.ws = new WebSocket(url);
        this.ws.onmessage = (event: MessageEvent<unknown>) => {
            this.messageListeners.forEach((listener) => {
                listener.onMessage(event);
            });
        };
        return this;
    }
}

export { MozillaWebSocketClient };
