import { expect, test } from '@jest/globals';
import { FetchHttpClient } from '@http';
import { HexUInt32 } from '@vechain/sdk-core';
import {
    GetTxReceiptResponse,
    RetrieveTransactionReceipt,
    ThorNetworks
} from '@thor';

/**
 * @group integration/transactions
 */
describe('RetrieveTransactionReceipt SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('ok <- tx id found', async () => {
        const txId = HexUInt32.of(
            '0x49144f58b7e5c0341573d68d3d69922ac017983ba07229d5c545b65a386759f1'
        );
        const actual = (
            await RetrieveTransactionReceipt.of(txId).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxReceiptResponse);
    });

    test('ok <- tx id and head', async () => {
        const txId = HexUInt32.of(
            '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a'
        );
        const head = HexUInt32.of(
            '0x000000015e6a01cfad0b4ad70e93d4c3e0672d045eaff79cea9bd68d6d98d6ed'
        );
        const actual = (
            await RetrieveTransactionReceipt.of(txId)
                .withHead(head)
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
