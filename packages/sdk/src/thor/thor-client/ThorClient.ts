import { AccountsModule } from './accounts/accounts-module';
import {
    FetchHttpClient,
    type HttpOptions,
    type HttpClient
} from '@common/http';
import { BlocksModule } from './blocks/blocks-module';
import { LogsModule } from './logs/logs-module';
import { GasModule } from './gas/gas-module';
import { NodesModule } from './nodes/nodes-module';
import { ContractsModule } from './contracts/contracts-module';
import { TransactionsModule } from './transactions/transactions-module';

/**
 * The `ThorClient` class serves as an abstractedinterface to interact with the VeChainThor blockchain.
 */
class ThorClient {
    /**
     * The `AccountsModule` instance
     */
    public readonly accounts: AccountsModule;

    /** blocks instance */
    public readonly blocks: BlocksModule;

    /** gas instance */
    public readonly gas: GasModule;

    /**
     * The `LogsModule` instance
     */
    public readonly logs: LogsModule;

    /**
     * The `NodesModule` instance
     */
    public readonly nodes: NodesModule;

    /**

     * The `ContractsModule` instance
     */
    public readonly contracts: ContractsModule;

    // The `TransactionsModule` instance

    public readonly transactions: TransactionsModule;

    /**
     * The `HttpClient` instance used for making network requests.
     */
    public readonly httpClient: HttpClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTPClient
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(httpClient: HttpClient) {
        // initialise module with httpClient
        // modules should expect thorClient to be set after construction
        this.httpClient = httpClient;
        this.accounts = new AccountsModule(httpClient);
        this.blocks = new BlocksModule(httpClient);
        this.gas = new GasModule(httpClient);
        this.logs = new LogsModule(httpClient);
        this.nodes = new NodesModule(httpClient);
        this.contracts = new ContractsModule(httpClient);
        this.transactions = new TransactionsModule(httpClient);

        // set thorClient to modules for cross-module communication
        // Type assertion: ThorClient implements IThorClient interface
        this.accounts.setThorClient(this);
        this.blocks.setThorClient(this);
        this.gas.setThorClient(this);
        this.logs.setThorClient(this);
        this.nodes.setThorClient(this);
        this.contracts.setThorClient(this);
        this.transactions.setThorClient(this);
    }

    /**
     * Creates a new `ThorClient` instance given a network URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {HttpOptions} options - The options to use for the created HTTP client.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     */
    public static at(networkUrl: string, options?: HttpOptions): ThorClient {
        return new ThorClient(
            new FetchHttpClient(new URL(networkUrl), options)
        );
    }

    /**
     * Creates a ThorClient instance given a HTTP client.
     *
     * @param {HttpClient} httpClient - The HTTP client instance used for making network requests.
     * @return {ThorClient} A ThorClient instance connected to the specified HTTP client.
     */
    public static fromHttpClient(httpClient: HttpClient): ThorClient {
        return new ThorClient(httpClient);
    }
}

export { ThorClient };
