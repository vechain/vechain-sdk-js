import { FetchHttpClient } from '../../http';
import { ThorNetworks } from '../ThorNetworks';
import { RetrieveBlock, RetrieveBlockPath } from '../blocks';
import { Revision, TxId } from '@vechain/sdk-core';
import { RetrieveTransactionByID } from '../transactions';

async function getBestBlockNumber(
    httpClient: FetchHttpClient
): Promise<number> {
    const r = await new RetrieveBlock(
        new RetrieveBlockPath(Revision.BEST)
    ).askTo(httpClient);
    return r.response.number.valueOf();
}

async function explore(): Promise<void> {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);
    const lastBlockNumber = await getBestBlockNumber(httpClient);
    for (let blockNumber = lastBlockNumber; blockNumber >= 0; blockNumber--) {
        const block = (
            await RetrieveBlock.of(Revision.of(blockNumber)).askTo(httpClient)
        ).response;
        console.log(`BLOCK ${block.number} of ${lastBlockNumber}`);
        for (const txid of block.transactions) {
            console.log(`TXID ${txid}`);
            const tx = (
                await RetrieveTransactionByID.of(
                    TxId.of(txid.toString())
                ).askTo(httpClient)
            ).response;

            console.log(`TX: ${JSON.stringify(tx, null, 2)}`);
        }
    }
}

console.log('Thor Scanner...');
void explore().then((_r) => {
    console.log('End of all jobs.');
});
