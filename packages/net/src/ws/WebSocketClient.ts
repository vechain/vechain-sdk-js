import type { WebSocketListener } from './WebSocketListener';
import { type HttpPath } from '../http';

interface WebSocketClient {
    get baseURL(): string;

    addMessageListener: (
        listener: WebSocketListener<unknown>
    ) => WebSocketClient;

    close: () => WebSocketClient;

    open: (path: HttpPath) => WebSocketClient;
}

export { type WebSocketClient };
