import { DATA, buildError } from '@vechain-sdk/errors';
import { revisionUtils, buildQuery, thorest } from '../../../utils';
import { type HttpClient } from '../../http';
import { type BlockDetail } from './types';

/**
 * The `BlockClient` class provides methods to interact with block-related endpoints
 * of the VechainThor blockchain. It allows fetching details of a specific blockchain block.
 */
class BlockClient {
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
                'Invalid revision. The revision must be a string representing a block number or block id.'
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
}

export { BlockClient };
