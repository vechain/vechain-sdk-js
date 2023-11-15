import { DATA, buildError } from '@vechainfoundation/vechain-sdk-errors';
import { revisionUtils, buildQuery, thorest } from '../../../utils';
import { type HttpClient } from '../../http';
import { type BlockDetail } from './types';

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
     * @param expanded - Whether the returned block is expanded.
     * @returns A promise that resolves to an object containing the block details.
     */
    public async getBlock(
        revision: string | number,
        expanded?: boolean
    ): Promise<BlockDetail | null> {
        if (revision != null && !revisionUtils.isRevisionBlock(revision)) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid revision. The revision must be a string representing a block number or block id.',
                { revision }
            );
        }

        return (await this.httpClient.http(
            'GET',
            thorest.blocks.get.BLOCK_DETAIL(revision),
            {
                query: buildQuery({ expanded })
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
     * Retrieves details of the finalized block.
     *
     * @returns A promise that resolves to an object containing the block details.
     */
    public async getFinalBlock(): Promise<BlockDetail | null> {
        return await this.getBlock('finalized');
    }

    /**
     * Resolves to the block at %%revision%% once it has been mined.
     * This can be useful for waiting some number of blocks by using
     * the ``currentBlockNumber + N``.
     *
     * @param revision - The block number or ID to wait for.
     * @returns A promise that resolves to an object containing the block details.
     */
    public async waitForBlock(revision: string | number): Promise<BlockDetail> {
        if (revision != null && !revisionUtils.isRevisionBlock(revision)) {
            throw buildError(
                DATA.INVALID_DATA_TYPE,
                'Invalid revision. The revision must be a string representing a block number or block id.',
                { revision }
            );
        }

        const block = await this.getBlock(revision);
        if (block != null) {
            return block;
        } else {
            return await this.waitForBlock(revision);
        }
    }
}

export { BlocksClient };
