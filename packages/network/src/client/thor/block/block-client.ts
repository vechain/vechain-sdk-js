import { type HttpClient } from '../../http';
import { thorest } from '../../../utils';
import { type BlockDetail } from './types';

class blockClient {
    /**
     * Initializes a new instance of the `BlockClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    public async getBlock(revision: string | number): Promise<BlockDetail> {
        return (await this.httpClient.http(
            'GET',
            thorest.block.BLOCK_DETAIL(revision)
        )) as BlockDetail;
    }
}

export { blockClient };
