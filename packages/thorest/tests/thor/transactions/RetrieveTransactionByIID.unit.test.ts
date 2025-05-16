import { describe, expect, test } from '@jest/globals';
import { TxId } from '@vechain/sdk-core';
import { type GetTxResponseJSON, RetrieveTransactionByID } from '../../../src';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 * VeChain transaction - unit
 *
 * @group unit/transaction
 */
describe('RetrieveTransactionByID unit tests', () => {
    test('ok <- askTo', async () => {
        const txId = TxId.of(
            '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934'
        );

        const mockResponse = {
            id: '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934',
            chainTag: 39,
            blockRef:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            expiration: 32,
            clauses: [
                {
                    to: '0x7d8Bf18C7ce84B3e175B339C4cA93Aed1dD488Aa',
                    // We are adding a leading zero to the value because of how VCDM's
                    // Hex is parsing and because we need an even number of hex-digits in other places
                    value: '0x05ec3db77eba739400',
                    data: '0x'
                }
            ],
            gasPriceCoef: 0,
            gas: 21000,
            origin: '0x7d8Bf18C7ce84B3e175B339C4cA93Aed1dD488Aa',
            nonce: '0xbc614e',
            dependsOn: undefined,
            delegator: null,
            size: 128,
            meta: {
                blockID:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                blockNumber: 1,
                blockTimestamp: 1000000
            }
        } satisfies GetTxResponseJSON;

        const mockClient = mockHttpClient<GetTxResponseJSON>(
            mockResponse,
            'get'
        );
        const response =
            await RetrieveTransactionByID.of(txId).askTo(mockClient);
        expect(response.response.toJSON()).toEqual(mockResponse);
    });
});
