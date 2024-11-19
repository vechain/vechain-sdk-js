import {
    AccountsModule,
    BlocksModule,
    type BlocksModuleOptions,
    ContractsModule,
    DebugModule,
    GasModule,
    LogsModule,
    NodesModule,
    TransactionsModule
} from '.';
import { SimpleHttpClient, type HttpClient } from '../http';

/**
 * The `ThorClient` class serves as an interface to interact with the VeChainThor blockchain.
 * It provides various methods.
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
     * The `DebugModule` instance
     */
    public readonly debug: DebugModule;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(
        readonly httpClient: HttpClient,
        options?: BlocksModuleOptions
    ) {
        this.accounts = new AccountsModule(httpClient);
        this.debug = new DebugModule(httpClient);
        this.blocks = new BlocksModule(httpClient, options);
        this.logs = new LogsModule(this.blocks);
        this.nodes = new NodesModule(this.blocks);
        this.transactions = new TransactionsModule(
            this.blocks,
            this.debug,
            this.logs
        );
        this.contracts = new ContractsModule(this.transactions);
        this.gas = new GasModule(this.transactions);
    }

    /**
     * Creates a new `ThorClient` instance from a given URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {BlocksModuleOptions} [options] - Optional configuration settings for the Blocks module.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     */
    public static at(
        networkUrl: string,
        options?: BlocksModuleOptions
    ): ThorClient {
        return new ThorClient(new SimpleHttpClient(networkUrl), options);
    }

    /**
     * Destroys the `ThorClient` instance by stopping the event polling
     * and any other cleanup.
     */
    public destroy(): void {
        this.blocks.destroy();
    }

    /**
     * Creates a ThorClient instance from a network URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {BlocksModuleOptions} [options] - Optional configuration settings for the Blocks module.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     *
     * @deprecated Use {@link ThorClient.at} instead.
     */
    public static fromUrl(
        networkUrl: string,
        options?: BlocksModuleOptions
    ): ThorClient {
        return ThorClient.at(networkUrl, options);
    }
}

export { ThorClient };
