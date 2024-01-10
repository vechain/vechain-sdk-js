import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { Poll, buildQuery, thorest } from '../../utils';
import {
    type WaitForBlockOptions,
    type BlockInputOptions,
    type BlockDetail
} from './types';
import { assertIsRevisionForBlock } from '@vechainfoundation/vechain-sdk-core';
import { type ThorClient } from '../thor-client';

/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VechainThor blockchain.
 */
class BlocksModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Retrieves details of a specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @param options - (Optional) Other optional parameters for the request.
     * @returns A promise that resolves to an object containing the block details.
     */
    public async getBlock(
        revision: string | number,
        options?: BlockInputOptions
    ): Promise<BlockDetail | null> {
        assertIsRevisionForBlock(revision);

        return (await this.thor.httpClient.http(
            'GET',
            thorest.blocks.get.BLOCK_DETAIL(revision),
            {
                query: buildQuery({ expanded: options?.expanded })
            }
        )) as BlockDetail | null;
    }

    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the block details.
     */
    public async getBestBlock(): Promise<BlockDetail | null> {
        return await this.getBlock('best');
    }

    /**
     * Asynchronously retrieves a reference to the best block in the blockchain.
     *
     * This method first calls `getBestBlock()` to obtain the current best block. If no block is found (i.e., if `getBestBlock()` returns `null`),
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
        const bestBlock = await this.getBestBlock();
        if (bestBlock === null) return null;
        return bestBlock.id.slice(0, 18);
    }

    /**
     * Retrieves details of the finalized block.
     *
     * @returns A promise that resolves to an object containing the block details.
     */
    public async getFinalBlock(): Promise<BlockDetail | null> {
        return await this.getBlock('finalized');
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
            async () => await this.getBestBlock(),
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
     * Retrieves details of the genesis block.
     *
     * @returns A promise that resolves to an object containing the block details of the genesis block.
     */
    public async getGenesisBlock(): Promise<BlockDetail | null> {
        return await this.getBlock(0);
    }
}

export { BlocksModule };
