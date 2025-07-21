/**
 * @group integration/transactions
 */
import { Hex, HexUInt32, Revision } from '@vcdm';
import {
    GetTxResponse,
    type RegularBlockResponse,
    RetrieveRegularBlock,
    RetrieveTransactionByID,
    ThorNetworks, toURL
} from '@thor';
import { FetchHttpClient } from '@http';
import { beforeAll, expect } from '@jest/globals';

/**
 * @group integration/transactions
 */
describe('RetrieveTransactionByID SOLO tests', () => {
    const httpClient = FetchHttpClient.at(toURL(ThorNetworks.SOLONET), {});

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
            await RetrieveTransactionByID.of(txId as Hex).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
    });

    test('ok <- tx id and head', async () => {
        expect(block?.id).toBeInstanceOf(Hex);
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveTransactionByID.of(txId as Hex)
                .withHead(block?.id as Hex)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
    });

    test('ok <- tx id and pending', async () => {
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveTransactionByID.of(txId as Hex)
                .withPending(true)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
    });

    test('ok <- tx id and head and pending', async () => {
        expect(block?.id).toBeInstanceOf(Hex);
        expect(txId).toBeInstanceOf(Hex);
        const actual = (
            await RetrieveTransactionByID.of(txId as Hex)
                .withHead(block?.id as Hex)
                .withPending(true)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
    });

    test('null <- tx not found', async () => {
        const txId = HexUInt32.of(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        const actual = (
            await RetrieveTransactionByID.of(txId).askTo(httpClient)
        ).response;
        expect(actual).toBeNull();
    });
});
