import type { WebSocketListener } from './WebSocketListener';
import { type HttpPath } from '../http';

interface WebSocketClient {
    get baseURL(): string;

    addListener: (listener: WebSocketListener<unknown>) => WebSocketClient;

    close: () => WebSocketClient;

    open: (path: HttpPath) => WebSocketClient;

    removeListener: (listener: WebSocketListener<unknown>) => WebSocketClient;
}

export { type WebSocketClient };
