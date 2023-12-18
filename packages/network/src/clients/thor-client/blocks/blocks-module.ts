import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { Poll } from '../../../utils';
import { type BlockDetail, type ThorestClient } from '../../thorest-client';
import { type WaitForBlockOptions } from './types';

/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VechainThor blockchain.
 */
class BlocksModule {
    /**
     * The head block (best block)
     * @private
     */
    private readonly headBlock: BlockDetail | null = null;

    /**
     * The Poll instance for event polling
     * @private
     */
    // private readonly pollInstance: EventPoll<BlockDetail | null> | null;

    /**
     * Initializes a new instance of the `Thorest` class.
     * @param thorest - The Thorest instance used to interact with the vechain Thorest blockchain API.
     */
    constructor(
        readonly thorest: ThorestClient
        // onBlockError?: (error: Error) => void
    ) {
        // Create Poll instance
        // this.pollInstance = Poll.createEventPoll(
        //     async () => await thorest.blocks.getBestBlock(),
        //     1000
        // );
        // Configure Poll instance
        // this.pollInstance
        //     .onData((data) => {
        //         this.headBlock = data;
        //     })
        //     .onError(onBlockError ?? ((_) => {}))
        //     .startListen();
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

    /**
     * Polls the head block (best block).
     * @returns The head block (best block)
     */
    public getHeadBlock(): BlockDetail | null {
        return this.headBlock;
    }

    /**
     * Destroys the instance by stopping the event poll.
     */
    // public destroy(): void {
    //     if (this.pollInstance != null) {
    //         this.pollInstance.stopListen();
    //         this.pollInstance = null;
    //     }
    // }
}

export { BlocksModule };
