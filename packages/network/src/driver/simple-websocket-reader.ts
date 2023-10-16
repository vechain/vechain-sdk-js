import WebSocket from 'isomorphic-ws';
import { type Net } from './interfaces';

export class SimpleWebSocketReader implements Net.WebSocketReader {
    private readonly ws: WebSocket;
    private callbacks = [] as Array<(data: unknown, error?: Error) => void>;
    private error?: Error;

    constructor(
        url: string,
        private readonly timeout = 30 * 1000
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        this.ws = new WebSocket(url);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.ws.onmessage = (ev: MessageEvent) => {
            try {
                const cbs = this.callbacks;
                this.callbacks = [];
                cbs.forEach((cb) => {
                    cb(ev.data);
                });
            } catch (err) {
                this.setError(err as Error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                this.ws.close();
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.ws.onerror = () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            // this.setError(ev.error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            this.ws.close();
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.ws.onclose = () => {
            this.setError(new Error('closed'));
        };
    }

    public async read(): Promise<unknown> {
        return await new Promise<unknown>((resolve, reject) => {
            if (this.error !== undefined) {
                reject(this.error);
                return;
            }

            const timer = setTimeout(() => {
                reject(new Error('ws read timeout'));
            }, this.timeout);

            this.callbacks.push((data, err) => {
                clearTimeout(timer);
                if (err !== undefined) {
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });
    }

    public close(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.ws.close();
    }

    private setError(err: Error): void {
        if (this.error !== null && this.error !== undefined) {
            this.error = err;

            const cbs = this.callbacks;
            this.callbacks = [];
            cbs.forEach((cb) => {
                cb(null, err);
            });
        }
    }
}
