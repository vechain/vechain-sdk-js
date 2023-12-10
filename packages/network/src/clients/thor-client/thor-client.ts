import { type HttpClient } from '../../utils';
import { NodesModule } from './nodes';
import { BlocksModule } from './blocks';
import { ContractsModule } from './contracts';
import { TransactionsModule } from './transactions';
import { GasModule } from './gas';

/**
 * The `ThorClient` class serves as an interface to interact with the Vechain Thor blockchain.
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
     * The `GasModule` instance
     */
    public readonly gas: GasModule;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.nodes = new NodesModule(httpClient);
        this.blocks = new BlocksModule(httpClient);
        this.transactions = new TransactionsModule(httpClient);
        this.contracts = new ContractsModule(httpClient);
        this.gas = new GasModule(httpClient);
    }
}

export { ThorClient };
