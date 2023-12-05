import { type HttpClient } from '../../utils';
import { NodesModule } from './nodes';
import { BlocksModule } from './blocks';
import { TransactionsModule } from './transactions';
import { ThorestClient } from '../thorest-client';

/**
 * The `ThorClient` class serves as an interface to interact with the Vechain Thor blockchain.
 * It provides various methods.
 * Essentially it can be considered a layer on top of the `ThorestClient`.
 */
class ThorClient {
    /**
     * The `ThorestClient` instance
     */
    public readonly thorest: ThorestClient;
    /**
     * The `NodesModule` instance
     */
    public readonly nodes: NodesModule;

    /**
     * The `BlocksModule` instance
     */
    public readonly blocks: BlocksModule;

    /*
     * The `TransactionsModule` instance
     */
    public readonly transactions: TransactionsModule;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.thorest = new ThorestClient(httpClient);
        this.nodes = new NodesModule(httpClient);
        this.blocks = new BlocksModule(httpClient);
        this.transactions = new TransactionsModule(httpClient);
    }
}

export { ThorClient };
