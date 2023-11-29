import { type HttpClient } from '../../utils';
import { NodesModule } from './nodes';
import { BlocksModule } from './blocks';

/**
 * The `ThorClient` class serves as an interface to interact with the Vechain Thor blockchain.
 * It provides various methods.
 * Essentially it can be considered a layer on top of the `ThorestClient`.
 */
class ThorClient {
    /**
     * The `NodeModule` instance
     */
    public readonly nodes: NodesModule;

    /**
     * The `BlocksModule` instance
     */
    public readonly blocks: BlocksModule;

    /**
     * Constructs a new `ThorClient` instance with a given HTTP client.
     * @param httpClient - The HTTP client instance used for making network requests.
     */
    constructor(protected readonly httpClient: HttpClient) {
        this.nodes = new NodesModule(httpClient);
        this.blocks = new BlocksModule(httpClient);
    }
}

export { ThorClient };
