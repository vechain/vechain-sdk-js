import { describe, expect, test } from '@jest/globals';
import { TxId } from '@vechain/sdk-core';
import { type GetTxReceiptResponseJSON, RetrieveTransactionReceipt } from '@thor';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 * VeChain transaction - unit
 *
 * @group unit/transaction
 */
describe('RetrieveTransactionReceipt unit tests', () => {
    test('ok <- askTo', async () => {
        const txId = TxId.of(
            '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934'
        );

        const mockResponse = {
            type: null,
            gasUsed: 2100,
            gasPayer: '0x7d8Bf18C7ce84B3e175B339C4cA93Aed1dD488Aa',
            paid: '0x1234567890',
            reward: '0x987654321',
            meta: {
                blockID:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                blockNumber: 0,
                blockTimestamp: 0,
                txID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                txOrigin:
                    '0x0000000000000000000000000000000000000000000000000000000000000000'
            },
            reverted: false,
            outputs: [
                {
                    contractAddress:
                        '0x0000000000000000000000000000000000000000',
                    events: [],
                    transfers: []
                }
            ],
            id: '0x0000000000000000000000000000000000000000000000000000000000000000',
            origin: '0x0000000000000000000000000000000000000000',
            size: 0,
            chainTag: 0,
            blockRef: '0x0000000000000000',
            expiration: 0,
            clauses: [],
            gas: 0,
            nonce: '0',
            delegator: null,
            dependsOn: null,
            gasPriceCoef: null
        } satisfies GetTxReceiptResponseJSON;

        const mockClient = mockHttpClient<GetTxReceiptResponseJSON>(
            mockResponse,
            'get'
        );
        const response =
            await RetrieveTransactionReceipt.of(txId).askTo(mockClient);
        expect(response.response.toJSON()).toEqual(mockResponse);
    });
});
