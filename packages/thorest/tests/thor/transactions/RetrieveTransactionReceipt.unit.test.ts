import { describe, expect, jest, test } from '@jest/globals';
import { TxId } from '@vechain/sdk-core';
import {
    type FetchHttpClient,
    type GetTxReceiptResponseJSON,
    RetrieveTransactionReceipt
} from '../../../src';

const mockHttpClient = <T>(response: T): FetchHttpClient => {
    return {
        get: jest.fn().mockImplementation(() => {
            return {
                json: jest.fn().mockImplementation(() => {
                    return response;
                })
            };
        })
    } as unknown as FetchHttpClient;
};

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
            gasUsed: 2100,
            gasPayer: '0x7d8Bf18C7ce84B3e175B339C4cA93Aed1dD488Aa',
            paid: '0x1234567890',
            reward: '0x0987654321',
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
            ]
        } satisfies GetTxReceiptResponseJSON;

        const mockClient = mockHttpClient(mockResponse);
        const response =
            await RetrieveTransactionReceipt.of(txId).askTo(mockClient);
        expect(response.response.toJSON()).toEqual(mockResponse);
    });
});
