import { describe, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveBlock,
    RetrieveBlockPath,
    ThorNetworks
} from '../../../src';
import { Revision } from '@vechain/sdk-core';

describe('RetrieveBlock testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveBlock.of(Revision.BEST).askTo(
            new FetchHttpClient(ThorNetworks.TESTNET)
        );
        console.log(JSON.stringify(r, null, 2));
    });

    test('explore', async () => {
        const httpClient = new FetchHttpClient(ThorNetworks.TESTNET);
        const lastBlockNumber = await getBestBlockNumber(httpClient);
        for (
            let blockNumber = 0;
            blockNumber <= lastBlockNumber;
            blockNumber++
        ) {
            const block = (
                await RetrieveBlock.of(Revision.of(blockNumber)).askTo(
                    httpClient
                )
            ).response;
            block.transactions.forEach((tx) => {
                console.log(`${block.number}/${tx}`);
            });
        }
    });

    async function getBestBlockNumber(
        httpClient: FetchHttpClient
    ): Promise<number> {
        const r = await new RetrieveBlock(
            new RetrieveBlockPath(Revision.BEST)
        ).askTo(httpClient);
        return r.response.number;
    }
});
