import { type WebSocketClient } from './WebSocketClient';
import { type WebSocketListener } from './WebSocketListener';
import { type HttpPath } from '../http';

class MozillaWebSocketClient implements WebSocketClient {
    readonly baseURL: string;

    private ws?: WebSocket;

    private readonly messageListeners: Array<WebSocketListener<unknown>> = [];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    addMessageListener(listener: WebSocketListener<unknown>): this {
        this.messageListeners.push(listener);
        return this;
    }

    close(): this {
        this.ws?.close();
        this.ws = undefined;
        return this;
    }

    open(path: HttpPath): this {
        this.close();
        this.ws = new WebSocket(this.baseURL + path.path);
        this.ws.onmessage = (event: MessageEvent<unknown>) => {
            this.messageListeners.forEach((listener) => {
                listener.onMessage(event);
            });
        };
        return this;
    }
}

export { MozillaWebSocketClient };
