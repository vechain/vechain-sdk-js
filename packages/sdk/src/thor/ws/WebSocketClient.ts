import { type HttpPath } from '@common/http';
import type { WebSocketListener } from '@thor/ws';

interface WebSocketClient {
    get baseURL(): string;

    addListener: (listener: WebSocketListener<unknown>) => WebSocketClient;

    close: () => WebSocketClient;

    open: (path: HttpPath) => WebSocketClient;

    removeListener: (listener: WebSocketListener<unknown>) => WebSocketClient;
}

export { type WebSocketClient };
