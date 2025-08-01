/**
 * @group integration/transactions
 */
import { Hex, HexUInt32, Revision } from '@common/vcdm';
import {
    GetRawTxResponse,
    type RegularBlockResponse,
    RetrieveRegularBlock,
    RetrieveRawTransactionByID,
    ThorNetworks
} from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { beforeAll, expect } from '@jest/globals';

/**
 * @group integration/transactions
 */
describe('RetrieveRawTransactionByID SOLO tests', () => {
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

    test('ok <- tx id', async () => {
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveRawTransactionByID.of(txId as Hex).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
    });

    test('ok <- tx id and head', async () => {
        expect(block?.id).toBeInstanceOf(Hex);
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveRawTransactionByID.of(txId as Hex)
                .withHead(block?.id as Hex)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
    });

    test('ok <- tx id and pending', async () => {
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveRawTransactionByID.of(txId as Hex)
                .withPending(true)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
    });

    test('ok <- tx id and head and pending', async () => {
        expect(block?.id).toBeInstanceOf(Hex);
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveRawTransactionByID.of(txId as Hex)
                .withHead(block?.id as Hex)
                .withPending(true)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
    });

    test('null <- tx not found', async () => {
        const txId = HexUInt32.of(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        const actual = (
            await RetrieveRawTransactionByID.of(txId).askTo(httpClient)
        ).response;
        expect(actual).toBeNull();
    });
});
