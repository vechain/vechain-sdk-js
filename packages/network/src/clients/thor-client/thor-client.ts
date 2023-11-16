import { type HttpClient } from '../../utils';
import { NodesClient } from './nodes';

/**
 * The `ThorClient` class serves as an interface to interact with the Vechain Thor blockchain.
 * It provides various methods.
 * Essentially it can be considered a layer on top of the `ThorestClient`.
 */
class ThorClient {
    /**
     * The `NodeClient` instance
     */
    public readonly nodes: NodesClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.nodes = new NodesClient(httpClient);
    }
}

export { ThorClient };
