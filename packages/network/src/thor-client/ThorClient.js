"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThorClient = void 0;
const _1 = require(".");
const http_1 = require("../http");
/**
 * The `ThorClient` class serves as an interface to interact with the VeChainThor blockchain.
 * It provides various methods.
 */
class ThorClient {
    httpClient;
    /**
     * The `AccountsModule` instance
     */
    accounts;
    /**
     * The `NodesModule` instance
     */
    nodes;
    /**
     * The `BlocksModule` instance
     */
    blocks;
    /**
     * The `LogsModule` instance used for interacting with log-related endpoints.
     */
    logs;
    /*
     * The `TransactionsModule` instance
     */
    transactions;
    /**
     * The 'ContractClient' instance
     */
    contracts;
    /**
     * The 'GalacticaForkDetector' instance
     */
    forkDetector;
    /**
     * The `GasModule` instance
     */
    gas;
    /**
     * The `DebugModule` instance
     */
    debug;
    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(httpClient, options) {
        this.httpClient = httpClient;
        this.accounts = new _1.AccountsModule(httpClient);
        this.debug = new _1.DebugModule(httpClient);
        this.blocks = new _1.BlocksModule(httpClient, options);
        this.logs = new _1.LogsModule(this.blocks);
        this.nodes = new _1.NodesModule(this.blocks);
        this.gas = new _1.GasModule(this.httpClient);
        this.forkDetector = new _1.ForkDetector(this.httpClient);
        this.transactions = new _1.TransactionsModule(this.blocks, this.debug, this.logs, this.gas, this.forkDetector);
        this.gas.setTransactionsModule(this.transactions); // gas module requires transaction module
        this.contracts = new _1.ContractsModule(this.transactions);
    }
    /**
     * Creates a new `ThorClient` instance from a given URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {BlocksModuleOptions} [options] - Optional configuration settings for the Blocks module.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     */
    static at(networkUrl, options) {
        return new ThorClient(new http_1.SimpleHttpClient(networkUrl), options);
    }
    /**
     * Destroys the `ThorClient` instance by stopping the event polling
     * and any other cleanup.
     */
    destroy() {
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
    static fromUrl(networkUrl, options) {
        return ThorClient.at(networkUrl, options);
    }
}
exports.ThorClient = ThorClient;
