import { FetchHttpClient } from '../../http';
import { ThorNetworks } from '../ThorNetworks';
import { RetrieveBlock, RetrieveBlockPath } from '../blocks';
import { Revision } from '@vechain/sdk-core';

async function getBestBlockNumber(
    httpClient: FetchHttpClient
): Promise<number> {
    const r = await new RetrieveBlock(
        new RetrieveBlockPath(Revision.BEST)
    ).askTo(httpClient);
    return r.response.number;
}

async function explore(): Promise<void> {
    const httpClient = new FetchHttpClient(ThorNetworks.TESTNET);
    const lastBlockNumber = await getBestBlockNumber(httpClient);
    for (let blockNumber = lastBlockNumber; blockNumber >= 0; blockNumber--) {
        const block = (
            await RetrieveBlock.of(Revision.of(blockNumber)).askTo(httpClient)
        ).response;
        console.log(block.number, lastBlockNumber);
        block.transactions.forEach((tx) => {
            console.log(tx);
        });
    }
}

console.log('explorer');
void explore().then((r) => {
    console.log(r);
});
