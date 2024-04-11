import { assert, DATA } from '@vechain/sdk-errors';
import { buildQuery, type EventPoll, Poll, thorest } from '../../utils';
import {
    type BlocksModuleOptions,
    type CompressedBlockDetail,
    type ExpandedBlockDetail,
    type WaitForBlockOptions
} from './types';
import { assertIsRevisionForBlock } from '@vechain/sdk-core';
import { type ThorClient } from '../thor-client';

/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VechainThor blockchain.
 */
class BlocksModule {
    /**
     * The head block (best block). This is updated by the event poll instance every time a new block is produced.
     * @private
     */
    private headBlock: CompressedBlockDetail | null = null;

    /**
     * Error handler for block-related errors.
     */
    public onBlockError?: (error: Error) => undefined;

    /**
     * The Poll instance for event polling
     * @private
     */
    private pollInstance?: EventPoll<CompressedBlockDetail | null>;

    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(
        readonly thor: ThorClient,
        options?: BlocksModuleOptions
    ) {
        this.onBlockError = options?.onBlockError;

        if (options?.isPollingEnabled === true) this.setupPolling();
    }

    /**
     * Destroys the instance by stopping the event poll.
     */
    public destroy(): void {
        if (this.pollInstance != null) {
            this.pollInstance.stopListen();
        }
    }

    /**
     * Sets up the event polling for the best block.
     * @private
     * */
    private setupPolling(): void {
        this.pollInstance = Poll.createEventPoll(
            async () => await this.thor.blocks.getBestBlockCompressed(),
            10000 // Poll every 10 seconds,
        )
            .onData((data) => {
                this.headBlock = data;
            })
            .onError(this.onBlockError ?? (() => {}));

        this.pollInstance.startListen();
    }

    /**
     * Retrieves details of a compressed specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @returns A promise that resolves to an object containing the details of the compressed block.
     */
    public async getBlockCompressed(
        revision: string | number
    ): Promise<CompressedBlockDetail | null> {
        assertIsRevisionForBlock('getBlockCompressed', revision);

        return (await this.thor.httpClient.http(
            'GET',
            thorest.blocks.get.BLOCK_DETAIL(revision)
        )) as CompressedBlockDetail | null;
    }

    /**
     * Retrieves details of an expanded specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @returns A promise that resolves to an object containing the details of the expanded block.
     */
    public async getBlockExpanded(
        revision: string | number
    ): Promise<ExpandedBlockDetail | null> {
        assertIsRevisionForBlock('getBlockExpanded', revision);

        return (await this.thor.httpClient.http(
            'GET',
            thorest.blocks.get.BLOCK_DETAIL(revision),
            {
                query: buildQuery({ expanded: true })
            }
        )) as ExpandedBlockDetail | null;
    }

    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the compressed block details.
     */
    public async getBestBlockCompressed(): Promise<CompressedBlockDetail | null> {
        return await this.getBlockCompressed('best');
    }

    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the expanded block details.
     */
    public async getBestBlockExpanded(): Promise<ExpandedBlockDetail | null> {
        return await this.getBlockExpanded('best');
    }

    /**
     * Asynchronously retrieves a reference to the best block in the blockchain.
     *
     * This method first calls `getBestBlockCompressed()` to obtain the current best block. If no block is found (i.e., if `getBestBlockCompressed()` returns `null`),
     * the method returns `null` indicating that there's no block to reference. Otherwise, it extracts and returns the first 18 characters of the
     * block's ID, providing the ref to the best block.
     *
     * @returns {Promise<string | null>} A promise that resolves to either a string representing the first 18 characters of the best block's ID,
     * or `null` if no best block is found.
     *
     * @Example:
     * const blockRef = await getBestBlockRef();
     * if (blockRef) {
     *     console.log(`Reference to the best block: ${blockRef}`);
     * } else {
     *     console.log("No best block found.");
     * }
     */
    public async getBestBlockRef(): Promise<string | null> {
        const bestBlock = await this.getBestBlockCompressed();
        if (bestBlock === null) return null;
        return bestBlock.id.slice(0, 18);
    }

    /**
     * Retrieves the finalized block.
     *
     * @returns A promise that resolves to an object containing the finalized block.
     */
    public async getFinalBlockCompressed(): Promise<CompressedBlockDetail | null> {
        return await this.getBlockCompressed('finalized');
    }

    /**
     * Retrieves details of the finalized block.
     *
     * @returns A promise that resolves to an object containing the finalized block details.
     */
    public async getFinalBlockExpanded(): Promise<ExpandedBlockDetail | null> {
        return await this.getBlockExpanded('finalized');
    }

    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param expanded - A boolean indicating whether to wait for an expanded block.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the compressed block.
     */
    private async _waitForBlock(
        blockNumber: number,
        expanded: boolean,
        options?: WaitForBlockOptions
    ): Promise<CompressedBlockDetail | ExpandedBlockDetail | null> {
        assert(
            'waitForBlock',
            blockNumber === undefined ||
                blockNumber === null ||
                blockNumber >= 0,
            DATA.INVALID_DATA_TYPE,
            'Invalid blockNumber. The blockNumber must be a number representing a block number.',
            { blockNumber }
        );

        // Use the Poll.SyncPoll utility to repeatedly call getBestBlock with a specified interval
        return await Poll.SyncPoll(
            async () =>
                expanded
                    ? await this.getBestBlockCompressed()
                    : await this.getBestBlockExpanded(),
            {
                requestIntervalInMilliseconds: options?.intervalMs,
                maximumWaitingTimeInMilliseconds: options?.timeoutMs
            }
        ).waitUntil((result) => {
            // Continue polling until the result's block number matches the specified revision
            return result != null && result?.number >= blockNumber;
        });
    }

    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the compressed block.
     */
    public async waitForBlockCompressed(
        blockNumber: number,
        options?: WaitForBlockOptions
    ): Promise<CompressedBlockDetail | null> {
        return (await this._waitForBlock(
            blockNumber,
            false,
            options
        )) as CompressedBlockDetail | null;
    }

    /**
     * Synchronously waits for a specific expanded block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the expanded block details.
     */
    public async waitForBlockExpanded(
        blockNumber: number,
        options?: WaitForBlockOptions
    ): Promise<ExpandedBlockDetail | null> {
        return (await this._waitForBlock(
            blockNumber,
            true,
            options
        )) as ExpandedBlockDetail | null;
    }

    /**
     * Returns the head block (best block).
     * @returns {BlockDetail | null} The head block (best block).
     */
    public getHeadBlock(): CompressedBlockDetail | null {
        return this.headBlock;
    }

    /**
     * Retrieves details of the genesis block.
     *
     * @returns A promise that resolves to an object containing the block details of the genesis block.
     */
    public async getGenesisBlock(): Promise<CompressedBlockDetail | null> {
        return await this.getBlockCompressed(0);
    }
}

export { BlocksModule };
