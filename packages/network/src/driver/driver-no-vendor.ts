import { type Net } from './interfaces';
import { Cache } from './cache';

class DriverNoVendor {
    public head: Connex.Thor.Status['head'];

    private readonly cache = new Cache();
    // to merge concurrent identical remote requests
    private readonly pendingRequests: Record<
        string,
        Promise<Connex.Thor.Block | null | undefined>
    > = {};

    constructor(
        protected readonly net: Net,
        readonly genesis: Connex.Thor.Block,
        initialHead?: Connex.Thor.Status['head']
    ) {
        if (initialHead != null) {
            this.head = initialHead;
        } else {
            this.head = {
                id: genesis.id,
                number: genesis.number,
                timestamp: genesis.timestamp,
                parentID: genesis.parentID,
                txsFeatures: genesis.txsFeatures,
                gasLimit: genesis.gasLimit
            };
        }
    }

    public async getBlock(
        revision: string | number
    ): Promise<Connex.Thor.Block | null | undefined> {
        return await this.cache.getBlock(
            revision,
            async () => await this.httpGet(`blocks/${revision}`)
        );
    }

    protected async mergeRequest(
        req: () => Promise<Connex.Thor.Block | null | undefined>,
        ...keyParts: unknown[]
    ): Promise<Connex.Thor.Block | null | undefined> {
        const key = JSON.stringify(keyParts);
        const pending = this.pendingRequests[key];

        if (pending != null) {
            return await pending;
        }
        return await (this.pendingRequests[key] = (async () => {
            try {
                return await req();
            } finally {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.pendingRequests[key];
            }
        })());
    }

    protected async httpGet(
        path: string,
        query?: Record<string, string>
    ): Promise<Connex.Thor.Block | null | undefined> {
        return await this.mergeRequest(
            async () => {
                query = query ?? {};
                return await this.net.http('GET', path, {
                    query,
                    body: {},
                    headers: {
                        'X-Custom-Header': 'custom-value'
                    },
                    validateResponseHeader: this.headerValidator
                });
            },
            path,
            query
        );
    }

    private get headerValidator() {
        return (headers: Record<string, string>) => {
            const xgid = headers['x-genesis-id'];
            if (xgid != null && xgid !== this.genesis.id) {
                throw new Error(`responded 'x-genesis-id' not matched`);
            }
        };
    }
}

export { DriverNoVendor };
