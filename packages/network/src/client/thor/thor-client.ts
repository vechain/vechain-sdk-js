import { type HttpClient } from '../http';
import { AccountClient } from './accounts';
import { BlockClient } from './blocks';
import { LogsClient } from './logs';
import { NodeClient } from './node';

/**
 * The `ThorClient` class serves as an interface to interact with the VeChain Thor blockchain.
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
    public readonly blocks: BlockClient;
    /**
     * The `LogsClient` instance used for interacting with block-related endpoints.
     */
    public readonly logs: LogsClient;

    /**
     * The `NodeClient` instance used for interacting with node-related endpoints.
     */
    public readonly node: NodeClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.accounts = new AccountClient(httpClient);
        this.blocks = new BlockClient(httpClient);
        this.logs = new LogsClient(httpClient);
        this.node = new NodeClient(httpClient);
    }
}

export { ThorClient };
