import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { type EventPoll, Poll } from '../../../utils';
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
    private headBlock: BlockDetail | null = null;

    /**
     * Error handler for block-related errors.
     * @private
     */
    private readonly onBlockError?: (error: Error) => void;

    /**
     * The Poll instance for event polling
     * @private
     */
    private pollInstance: EventPoll<BlockDetail | null> | null = null;

    /**
     * Initializes a new instance of the `Thorest` class.
     * @param thorest - The Thorest instance used to interact with the vechain Thorest blockchain API.
     */
    constructor(
        readonly thorest: ThorestClient,
        onBlockError?: (error: Error) => void
    ) {
        if (onBlockError != null) this.onBlockError = onBlockError;

        this.setupPolling();
    }

    private async getTimeToNextBlock(): Promise<number> {
        const bestBlock = await this.thorest.blocks.getBestBlock();

        if (bestBlock != null)
            return bestBlock.timestamp * 1000 + 10000 - Date.now();

        return 0;
    }

    private setupPolling(): void {
        this.pollInstance = Poll.createEventPoll(
            async () => await this.thorest.blocks.getBestBlock(),
            10000 // Poll every 10 seconds,
        )
            .onData((data) => {
                this.headBlock = data;
            })
            .onError(this.onBlockError ?? (() => {}));

        this.pollInstance.startListen();
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
    public destroy(): void {
        if (this.pollInstance != null) {
            this.pollInstance.stopListen();
            this.pollInstance = null;
        }
    }
}

export { BlocksModule };
