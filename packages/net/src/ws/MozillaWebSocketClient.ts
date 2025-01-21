import { type WebSocketClient } from './WebSocketClient';
import { type WebSocketListener } from './WebSocketListener';
import { type HttpPath } from '../http';

class MozillaWebSocketClient implements WebSocketClient {
    readonly baseURL: string;

    private ws?: WebSocket;

    private readonly listeners: Array<WebSocketListener<unknown>> = [];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    addListener(listener: WebSocketListener<unknown>): this {
        this.listeners.push(listener);
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
        this.ws.onopen = (event: Event) => {
            this.listeners.forEach((listener) => {
                listener.onOpen?.(event);
            });
        };
        this.ws.onerror = (event: Event) => {
            this.listeners.forEach((listener) => {
                listener.onError?.(event);
            });
        };
        this.ws.onmessage = (event: MessageEvent<unknown>) => {
            this.listeners.forEach((listener) => {
                listener.onMessage?.(event);
            });
        };
        this.ws.onclose = (event: CloseEvent) => {
            this.listeners.forEach((listener) => {
                listener.onClose?.(event);
            });
            this.ws = undefined;
        };
        return this;
    }

    removeListener(listener: WebSocketListener<unknown>): this {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
        return this;
    }
}

export { MozillaWebSocketClient };
