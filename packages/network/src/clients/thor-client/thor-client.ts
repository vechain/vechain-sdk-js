import { AccountsModule } from './accounts';
import { NodesModule } from './nodes';
import { BlocksModule } from './blocks';
import { ContractsModule } from './contracts';
import { TransactionsModule } from './transactions';
import { LogsModule } from './logs';
import { type ThorestClient } from '../thorest-client';
import { GasModule } from './gas';

/**
 * The `ThorClient` class serves as an interface to interact with the vechain Thor blockchain.
 * It provides various methods.
 * Essentially it can be considered a layer on top of the `ThorestClient`.
 */
class ThorClient {
    /**
     * The `AccountsModule` instance
     */
    public readonly accounts: AccountsModule;

    /**
     * The `NodesModule` instance
     */
    public readonly nodes: NodesModule;

    /**
     * The `BlocksModule` instance
     */
    public readonly blocks: BlocksModule;

    /**
     * The `LogsModule` instance used for interacting with log-related endpoints.
     */
    public readonly logs: LogsModule;

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
    constructor(readonly thorest: ThorestClient) {
        this.accounts = new AccountsModule(thorest.httpClient);
        this.nodes = new NodesModule(this);
        this.blocks = new BlocksModule(thorest);
        this.logs = new LogsModule(thorest.httpClient);
        this.transactions = new TransactionsModule(this);
        this.contracts = new ContractsModule(this);
        this.gas = new GasModule(thorest);
    }
}

export { ThorClient };
