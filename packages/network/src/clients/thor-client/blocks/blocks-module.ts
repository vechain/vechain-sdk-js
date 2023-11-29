import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { type HttpClient, Poll } from '../../../utils';
import { type BlockDetail, BlocksClient } from '../../thorest-client';
import { type WaitForBlockOptions } from './types';

/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VechainThor blockchain.
 */
class BlocksModule {
    /**
     * Internal blocks client instance used for interacting with block-related endpoints.
     */
    private readonly blocksClient: BlocksClient;

    /**
     * Initializes a new instance of the `NodeModule` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(readonly httpClient: HttpClient) {
        // Create an instance of BlocksClient using the provided HTTP client
        this.blocksClient = new BlocksClient(httpClient);
    }

    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param revision - The block number or ID to wait for.
     * @returns A promise that resolves to an object containing the block details.
     */
    public async waitForBlock(
        blockNumber: number,
        options?: WaitForBlockOptions
    ): Promise<BlockDetail | null> {
        assert(
            blockNumber === undefined ||
                blockNumber === null ||
                typeof blockNumber !== 'number' ||
                blockNumber > 0,
            DATA.INVALID_DATA_TYPE,
            'Invalid blockNumber. The blockNumber must be a number representing a block number.',
            { blockNumber }
        );

        // Use the Poll.SyncPoll utility to repeatedly call getBestBlock with a specified interval
        const block = await Poll.SyncPoll(
            async () => await this.blocksClient.getBestBlock(),
            {
                requestIntervalInMilliseconds: options?.intervalMs,
                maximumWaitingTimeInMilliseconds: options?.timeoutMs
            }
        ).waitUntil((result) => {
            // Continue polling until the result's block number matches the specified revision
            return result != null && result?.number >= blockNumber;
        });

        return block;
    }
}

export { BlocksModule };
