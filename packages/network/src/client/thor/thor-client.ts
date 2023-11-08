import { type HttpClient } from '../http';
import { AccountClient } from './accounts';
import { BlockClient } from './blocks';

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
     * The `ABlockClient` instance used for interacting with block-related endpoints.
     */
    public readonly blocks: BlockClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.accounts = new AccountClient(httpClient);
        this.blocks = new BlockClient(httpClient);
    }
}

export { ThorClient };
