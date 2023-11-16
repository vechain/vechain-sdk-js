import { type HttpClient, thorest } from '../../../utils';
import { type ConnectedPeer } from './types';

/**
 * Provides utility method for checking the health of a node.
 */
class NodesClient {
    /**
     * Initializes a new instance of the `NodesClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * Retrieves connected peers of a node.
     *
     * @returns A promise that resolves to the list of connected peers.
     */
    public async getNodes(): Promise<ConnectedPeer | null> {
        return (await this.httpClient.http(
            'GET',
            thorest.nodes.get.NODES()
        )) as ConnectedPeer | null;
    }
}

export { NodesClient };
