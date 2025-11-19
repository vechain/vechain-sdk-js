import { AccountsModule, BlocksModule, type BlocksModuleOptions, ContractsModule, DebugModule, GasModule, LogsModule, NodesModule, TransactionsModule, ForkDetector } from '.';
import { type HttpClient } from '../http';
/**
 * The `ThorClient` class serves as an interface to interact with the VeChainThor blockchain.
 * It provides various methods.
 */
declare class ThorClient {
    readonly httpClient: HttpClient;
    /**
     * The `AccountsModule` instance
     */
    readonly accounts: AccountsModule;
    /**
     * The `NodesModule` instance
     */
    readonly nodes: NodesModule;
    /**
     * The `BlocksModule` instance
     */
    readonly blocks: BlocksModule;
    /**
     * The `LogsModule` instance used for interacting with log-related endpoints.
     */
    readonly logs: LogsModule;
    readonly transactions: TransactionsModule;
    /**
     * The 'ContractClient' instance
     */
    readonly contracts: ContractsModule;
    /**
     * The 'GalacticaForkDetector' instance
     */
    readonly forkDetector: ForkDetector;
    /**
     * The `GasModule` instance
     */
    readonly gas: GasModule;
    /**
     * The `DebugModule` instance
     */
    readonly debug: DebugModule;
    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(httpClient: HttpClient, options?: BlocksModuleOptions);
    /**
     * Creates a new `ThorClient` instance from a given URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {BlocksModuleOptions} [options] - Optional configuration settings for the Blocks module.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     */
    static at(networkUrl: string, options?: BlocksModuleOptions): ThorClient;
    /**
     * Destroys the `ThorClient` instance by stopping the event polling
     * and any other cleanup.
     */
    destroy(): void;
    /**
     * Creates a ThorClient instance from a network URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {BlocksModuleOptions} [options] - Optional configuration settings for the Blocks module.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     *
     * @deprecated Use {@link ThorClient.at} instead.
     */
    static fromUrl(networkUrl: string, options?: BlocksModuleOptions): ThorClient;
}
export { ThorClient };
//# sourceMappingURL=ThorClient.d.ts.map