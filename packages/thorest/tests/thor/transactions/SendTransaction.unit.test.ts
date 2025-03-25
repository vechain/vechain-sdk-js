import { describe, test, expect } from '@jest/globals';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { type FetchHttpClient, SendTransaction, TXID } from '../../../src';

// Define test fixtures locally
const TEST_ACCOUNTS = {
    TRANSACTION: {
        TRANSACTION_SENDER: {
            privateKey:
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        }
    }
};

const transferTransactionBody = {
    chainTag: 1,
    blockRef: '0x00000000aabbccdd',
    expiration: 32,
    clauses: [],
    gasPriceCoef: 0,
    gas: 21000,
    dependsOn: null,
    nonce: '0x1234'
};

const mockHttpClient = <T>(response: T): FetchHttpClient => {
    return {
        post: jest.fn().mockImplementation(() => {
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
describe('SendTransaction solo tests', () => {
    test('ok <- askTo', async () => {
        const gasResult = {
            totalGas: 21000,
            reverted: false,
            revertReasons: [],
            vmErrors: []
        };
        const tx = Transaction.of({
            ...transferTransactionBody,
            gas: gasResult.totalGas,
            nonce: 10000000
        }).sign(
            HexUInt.of(TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey)
                .bytes
        ).encoded;
        const response = await SendTransaction.of(tx).askTo(
            mockHttpClient(new TXID({ id: '0x123' }))
        );

        expect(response.response.toJSON()).toEqual(
            new TXID({ id: '0x123' }).toJSON()
        );
    });
});
