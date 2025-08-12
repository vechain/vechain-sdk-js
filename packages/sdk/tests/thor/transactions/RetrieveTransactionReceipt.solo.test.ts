import { beforeAll, expect, test } from '@jest/globals';
import { FetchHttpClient } from '@http';
import { Hex, HexUInt32, Revision } from '@vcdm';
import {
    GetTxReceiptResponse,
    type RegularBlockResponse,
    RetrieveRegularBlock,
    RetrieveTransactionReceipt,
    ThorNetworks
} from '@thor';

/**
 * @group integration/thor/transactions
 */
describe('RetrieveTransactionReceipt SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    let block: RegularBlockResponse | null;

    let txId: Hex | undefined;

    // The first block has a first transaction.
    beforeAll(async () => {
        block = (
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        txId = block?.transactions?.at(0);
    });

    test('ok <- tx id found', async () => {
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveTransactionReceipt.of(txId as Hex).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxReceiptResponse);
    });

    test('ok <- tx id and head', async () => {
        expect(block?.id).toBeInstanceOf(Hex);
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveTransactionReceipt.of(txId as Hex)
                .withHead(block?.id as Hex)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxReceiptResponse);
    });

    test('null <- tx not found', async () => {
        const txId = HexUInt32.of(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        const actual = (
            await RetrieveTransactionReceipt.of(txId).askTo(httpClient)
        ).response;
        expect(actual).toBeNull();
    });
});
