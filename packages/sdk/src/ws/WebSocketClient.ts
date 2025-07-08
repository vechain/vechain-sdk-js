import { type HttpPath } from '@http';
import type { WebSocketListener } from '@ws';

interface WebSocketClient {
    get baseURL(): string;

    addListener: (listener: WebSocketListener<unknown>) => WebSocketClient;

    close: () => WebSocketClient;

    open: (path: HttpPath) => WebSocketClient;

    removeListener: (listener: WebSocketListener<unknown>) => WebSocketClient;
}

export { type WebSocketClient };
