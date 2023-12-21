import { type HttpClient } from '../../utils';

/**
 * The `ThorestClient` class serves as an interface to interact with the vechain Thorest blockchain API.
 * It provides methods for accessing accounts, blocks, logs, transactions and nodes endpoints.
 * Basically it can be considered a wrapper of Thorest API.
 */
class ThorestClient {
    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(readonly httpClient: HttpClient) {}
}

export { ThorestClient };
