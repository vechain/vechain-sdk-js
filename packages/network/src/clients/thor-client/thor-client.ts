import { NodesModule } from './nodes';
import { BlocksModule } from './blocks';
import { ContractsModule } from './contracts';
import { TransactionsModule } from './transactions';
import { type ThorestClient } from '../thorest-client';

/**
 * The `ThorClient` class serves as an interface to interact with the vechain Thor blockchain.
 * It provides various methods.
 * Essentially it can be considered a layer on top of the `ThorestClient`.
 */
class ThorClient {
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
     * The 'ContractClient' instance
     */
    public readonly contracts: ContractsModule;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(readonly thorest: ThorestClient) {
        this.nodes = new NodesModule(thorest);
        this.blocks = new BlocksModule(thorest);
        this.transactions = new TransactionsModule(thorest);
        this.contracts = new ContractsModule(thorest);
    }
}

export { ThorClient };
