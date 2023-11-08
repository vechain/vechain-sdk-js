import { type HttpClient } from '../../http';
import { thorest } from '../../../utils';
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
     * @returns A promise that resolves to an object containing the block details.
     */
    public async getBlock(revision: string | number): Promise<BlockDetail> {
        return (await this.httpClient.http(
            'GET',
            thorest.blocks.BLOCK_DETAIL(revision)
        )) as BlockDetail;
    }
}

export { BlockClient };
