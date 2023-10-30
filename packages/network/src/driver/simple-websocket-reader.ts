import { WebSocket } from 'isomorphic-ws';
import { type WebSocketReader } from './interfaces';

export class SimpleWebSocketReader implements WebSocketReader {
    private readonly ws: WebSocket;
    private callbacks = [] as Array<(data: unknown, error?: Error) => void>;

    private error?: Error;

    constructor(
        url: string,
        private readonly timeout = 30 * 1000
    ) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (ev) => {
            try {
                const cbs = this.callbacks;
                this.callbacks = [];
                cbs.forEach((cb) => {
                    cb(ev.data);
                });
            } catch (err) {
                this.setError(err as Error);
                this.ws.close();
            }
        };
        this.ws.onerror = (ev) => {
            this.setError(ev.error as Error);
            this.ws.close();
        };
        this.ws.onclose = () => {
            this.setError(new Error('closed'));
        };
    }

    public async read(): Promise<unknown> {
        return await new Promise<unknown>((resolve, reject) => {
            if (this.error != null) {
                reject(this.error);
                return;
            }

            const timer = setTimeout(() => {
                reject(new Error('ws read timeout'));
            }, this.timeout);

            this.callbacks.push((data, err) => {
                clearTimeout(timer);
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    public close(): void {
        this.ws.close();
    }

    private setError(err: Error): void {
        if (this.error != null) {
            this.error = err;

            const cbs = this.callbacks;
            this.callbacks = [];
            cbs.forEach((cb) => {
                cb(null, err);
            });
        }
    }
}
