import { type HttpClient } from '../http';
import { AccountClient } from './accounts';
import { BlocksClient } from './blocks';
import { LogsClient } from './logs';
import { TransactionClient } from './transactions';
import { NodesClient } from './nodes';

/**
 * The `ThorClient` class serves as an interface to interact with the Vechain Thor blockchain.
 * It provides methods for accessing account details, contract bytecode, and storage.
 */
class ThorClient {
    /**
     * The `AccountClient` instance used for interacting with account-related endpoints.
     */
    public readonly accounts: AccountClient;

    /**
     * The `BlockClient` instance used for interacting with block-related endpoints.
     */
    public readonly blocks: BlocksClient;

    /**
     * The `LogsClient` instance used for interacting with log-related endpoints.
     */
    public readonly logs: LogsClient;

    /**
     * The `TransactionClient` instance used for interacting with transaction-related endpoints.
     */
    public readonly transactions: TransactionClient;

    /**
     * The `NodeClient` instance used for interacting with node-related endpoints.
     */
    public readonly nodes: NodesClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.accounts = new AccountClient(httpClient);
        this.blocks = new BlocksClient(httpClient);
        this.logs = new LogsClient(httpClient);
        this.nodes = new NodesClient(httpClient);
        this.transactions = new TransactionClient(httpClient);
    }
}

export { ThorClient };
