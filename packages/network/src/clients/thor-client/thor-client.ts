import { type HttpClient } from '../../utils';
import { NodesThorClient } from './nodes';
import { BlocksThorClient } from './blocks';

/**
 * The `ThorClient` class serves as an interface to interact with the Vechain Thor blockchain.
 * It provides various methods.
 * Essentially it can be considered a layer on top of the `ThorestClient`.
 */
class ThorClient {
    /**
     * The `NodeClient` instance
     */
    public readonly nodes: NodesThorClient;

    /**
     * The `BlocksClient` instance
     */
    public readonly blocks: BlocksThorClient;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.nodes = new NodesThorClient(httpClient);
        this.blocks = new BlocksThorClient(httpClient);
    }
}

export { ThorClient };
