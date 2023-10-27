import { type Net } from './interfaces';
import { Cache } from './cache';
import { type Block, type ThorStatus } from '../types';

// DriverNoVendor class for handling network requests and caching
class DriverNoVendor {
    public head: ThorStatus['head']; // Current blockchain head status

    private readonly cache = new Cache(); // Cache for storing network responses
    // To merge concurrent identical remote requests
    private readonly pendingRequests: Record<
        string,
        Promise<Block | null | undefined>
    > = {};

    /**
     * Creates an instance of DriverNoVendor.
     * @param net - The network interface to use for making HTTP requests.
     * @param genesis - The genesis block of the blockchain.
     * @param initialHead - (Optional) Initial blockchain head status.
     */
    constructor(
        protected readonly net: Net,
        readonly genesis: Block,
        initialHead?: ThorStatus['head']
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

    /**
     * Retrieve a block by revision.
     * @param revision - The block revision (number or ID).
     * @returns A promise that resolves to the requested block.
     */
    public async getBlock(
        revision: string | number
    ): Promise<Block | null | undefined> {
        return await this.cache.getBlock(
            revision,
            async () => await this.httpGet(`blocks/${revision}`)
        );
    }

    /**
     * Merge concurrent requests with the same key.
     * @param req - The request function to execute.
     * @param keyParts - Parts of the key used to merge requests.
     * @returns A promise that resolves to the merged request result.
     */
    protected async mergeRequest(
        req: () => Promise<Block | null | undefined>,
        ...keyParts: unknown[]
    ): Promise<Block | null | undefined> {
        const key = JSON.stringify(keyParts);
        const pending = this.pendingRequests[key];

        if (pending != null) {
            return await pending;
        }
        return await (this.pendingRequests[key] = (async () => {
            try {
                return await req();
            } finally {
                // Remove the request from the pending queue after completion
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this.pendingRequests[key];
            }
        })());
    }

    /**
     * Make an HTTP GET request with optional query parameters.
     * @param path - The path to the resource.
     * @param query - (Optional) Query parameters for the request.
     * @returns A promise that resolves to the HTTP response data.
     */
    protected async httpGet(
        path: string,
        query?: Record<string, string>
    ): Promise<Block | null | undefined> {
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

    // Validate the response header to ensure it matches the genesis block's ID
    private get headerValidator() {
        return (headers: Record<string, string>) => {
            const xgid = headers['x-genesis-id'];
            if (xgid != null && xgid !== this.genesis.id) {
                throw new Error(
                    `Responded 'x-genesis-id' does not match the expected genesis ID`
                );
            }
        };
    }
}

export { DriverNoVendor };
