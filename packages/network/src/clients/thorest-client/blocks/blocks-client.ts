import { buildQuery, thorest, type HttpClient } from '../../../utils';
import { type BlockDetail, type BlockInputOptions } from './types';
import { assertIsRevisionForBlock } from '@vechainfoundation/vechain-sdk-core';

/**
 * The `BlockClient` class provides methods to interact with block-related endpoints
 * of the VechainThor blockchain. It allows fetching details of a specific blockchain block.
 */
class BlocksClient {
    /**
     * Initializes a new instance of the `BlockClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

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

        return (await this.httpClient.http(
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
}

export { BlocksClient };
