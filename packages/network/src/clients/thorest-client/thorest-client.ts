import { type HttpClient } from '../../utils';
import { AccountsClient } from './accounts';
import { BlocksClient } from './blocks';
import { LogsClient } from './logs';
import { TransactionsClient } from './transactions';
import { NodesClient } from './nodes';

/**
 * The `ThorestClient` class serves as an interface to interact with the vechain Thorest blockchain API.
 * It provides methods for accessing accounts, blocks, logs, transactions and nodes endpoints.
 * Basically it can be considered a wrapper of Thorest API.
 */
class ThorestClient {
    /**
     * The `AccountClient` instance used for interacting with account-related endpoints.
     */
    public readonly accounts: AccountsClient;

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
    public readonly transactions: TransactionsClient;

    /**
     * The `NodeClient` instance used for interacting with node-related endpoints.
     */
    public readonly nodes: NodesClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(readonly httpClient: HttpClient) {
        this.accounts = new AccountsClient(httpClient);
        this.blocks = new BlocksClient(httpClient);
        this.logs = new LogsClient(httpClient);
        this.nodes = new NodesClient(httpClient);
        this.transactions = new TransactionsClient(httpClient);
    }
}

export { ThorestClient };
