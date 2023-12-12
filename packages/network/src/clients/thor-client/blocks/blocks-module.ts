import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { Poll } from '../../../utils';
import { type BlockDetail, type ThorestClient } from '../../thorest-client';
import { type WaitForBlockOptions } from './types';

/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VechainThor blockchain.
 */
class BlocksModule {
    /**
     * Initializes a new instance of the `Thorest` class.
     * @param thorest - The Thorest instance used to interact with the vechain Thorest blockchain API.
     */
    constructor(readonly thorest: ThorestClient) {}

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
                blockNumber >= 0,
            DATA.INVALID_DATA_TYPE,
            'Invalid blockNumber. The blockNumber must be a number representing a block number.',
            { blockNumber }
        );

        // Use the Poll.SyncPoll utility to repeatedly call getBestBlock with a specified interval
        const block = await Poll.SyncPoll(
            async () => await this.thorest.blocks.getBestBlock(),
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
