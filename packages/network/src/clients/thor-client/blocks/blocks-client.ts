import { type HttpClient, Poll } from '../../../utils';
import { type BlockDetail, BlocksClient } from '../../thorest-client';

/** The `BlocksThorClient` class encapsulates functionality for interacting with blocks
 * on the VechainThor blockchain.
 */
class BlocksThorClient {
    /**
     * Internal blocks client instance used for interacting with block-related endpoints.
     */
    private readonly blocksClient: BlocksClient;

    /**
     * Initializes a new instance of the `NodeClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(readonly httpClient: HttpClient) {
        // Create an instance of BlocksClient using the provided HTTP client
        this.blocksClient = new BlocksClient(httpClient);
    }

    /**
     * Asynchronously waits for a specific block revision using polling.
     *
     * @param revision - The block number or ID to wait for.
     * @returns A promise that resolves to an object containing the block details.
     */
    public async waitForBlock(
        revision: string | number
    ): Promise<BlockDetail | null> {
        // Use the Poll.SyncPoll utility to repeatedly call getBestBlock with a specified interval
        const block = await Poll.SyncPoll(
            async () => await this.blocksClient.getBestBlock(),
            {
                // Set the interval for making requests in milliseconds
                requestIntervalInMilliseconds: 1000
            }
        ).waitUntil((result) => {
            // Continue polling until the result's block number matches the specified revision
            return result?.number === revision;
        });

        return block;
    }
}

export { BlocksThorClient };
