import { expect, test } from '@jest/globals';
import { FetchHttpClient } from '@http';
import { HexUInt32 } from '@vechain/sdk-core';
import { RetrieveTransactionReceipt, ThorNetworks } from '@thor';

/**
 * @group integration/transactions
 */
describe('RetrieveTransactionReceipt SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('ok <- tx found', async () => {
        const txId = HexUInt32.of(
            '0x49144f58b7e5c0341573d68d3d69922ac017983ba07229d5c545b65a386759f1'
        );
        const actual = (
            await RetrieveTransactionReceipt.of(txId).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
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
