import { type HttpClient, Poll } from '../../../utils';
import { type BlockDetail, BlocksClient } from '../../thorest-client';

class BlocksThorClient {
    private readonly blocksClient: BlocksClient;

    constructor(readonly httpClient: HttpClient) {
        this.blocksClient = new BlocksClient(httpClient);
    }

    public async waitForBlock(
        revision: string | number
    ): Promise<BlockDetail | null> {
        const block = await Poll.SyncPoll(
            async () => await this.blocksClient.getBestBlock(),
            {
                requestIntervalInMilliseconds: 1000
            }
        ).waitUntil((result) => {
            return result?.number === revision;
        });
        return block;
    }
}

export { BlocksThorClient };
