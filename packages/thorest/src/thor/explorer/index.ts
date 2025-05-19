import { FetchHttpClient } from '@http';
import { RetrieveTransactionByID } from '@thor/transactions';
import { RetrieveRegularBlock } from '@thor/blocks';
import { ThorNetworks } from '../utils';
import { Revision, TxId } from '@vechain/sdk-core';

async function getBestBlockNumber(
    httpClient: FetchHttpClient
): Promise<number> {
    const r = await RetrieveRegularBlock.of(Revision.BEST).askTo(httpClient);
    return r.response.number.valueOf();
}

async function explore(): Promise<void> {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);
    const lastBlockNumber = await getBestBlockNumber(httpClient);
    for (let blockNumber = lastBlockNumber; blockNumber >= 0; blockNumber--) {
        const block = (
            await RetrieveRegularBlock.of(Revision.of(blockNumber)).askTo(
                httpClient
            )
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
