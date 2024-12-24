import type { WebSocketListener } from './WebSocketListener';
import { type HttpPath } from '../http';

interface WebSocketClient {
    addMessageListener: (
        listener: WebSocketListener<unknown>
    ) => WebSocketClient;

    get baseURL(): string;

    close: () => WebSocketClient;

    open: (path: HttpPath) => WebSocketClient;
}

export { type WebSocketClient };
