import { type HttpClient } from '../http';
import { AccountClient } from './accounts';

/**
 * The `ThorClient` class serves as an interface to interact with the VeChain Thor blockchain.
 * It provides methods for accessing account details, contract bytecode, and storage.
 */
class ThorClient extends AccountClient {
    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        super(httpClient);
    }
}

export { ThorClient };
