import { describe, expect, test } from '@jest/globals';
import { TxId } from '@vechain/sdk-core';
import {
    RetrieveRawTransactionByID,
    type GetRawTxResponseJSON
} from '@thor';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 * VeChain transaction - unit
 *
 * @group unit/transaction
 */
describe('RetrieveRawTransactionByID unit tests', () => {
    test('ok <- askTo', async () => {
        const txId = TxId.of(
            '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934'
        );

        const mockResponse = {
            raw: '0xf8970184aabbccdd20f840df947d8bf18c7ce84b3e175b339c4ca93aed1dd4885501a69400000000000000000000000000000000000000000880de0b6b3a76400008028a0a8134669348e8a7ad34a64a193def01cc0d0f77935f134120ef507a87dcfe39da0046ae0acb1b9c47aadb38c2f0ce5789be81d194471378b14c53f3c6677f209c4',
            meta: {
                blockID:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                blockNumber: 1,
                blockTimestamp: 1000000
            }
        } satisfies GetRawTxResponseJSON;

        const mockClient = mockHttpClient<GetRawTxResponseJSON>(
            mockResponse,
            'get'
        );
        const response =
            await RetrieveRawTransactionByID.of(txId).askTo(mockClient);
        expect(response.response.toJSON()).toEqual(mockResponse);
    });
});
