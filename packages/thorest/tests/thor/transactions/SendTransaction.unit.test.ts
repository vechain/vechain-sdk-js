import { describe, expect, jest, test } from '@jest/globals';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { type FetchHttpClient, SendTransaction, TXID } from '../../../src';
import {
    ABIContract,
    networkInfo,
    type TransactionBody,
    Units
} from '@vechain/sdk-core/src';
import { BUILT_IN_CONTRACTS } from './built-in';

// Define test fixtures locally due to broken imports
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
    const TEST_ACCOUNTS_TRANSACTION_SENDER_PRIVATE_KEY =
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5';

    const TEST_ACCOUNTS_TRANSACTION_TRANSACTION_RECEIVER_ADDRESS =
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39';

    const transfer1VTHOClause = {
        to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
        value: '0',
        data: ABIContract.ofAbi(BUILT_IN_CONTRACTS.ENERGY_ABI)
            .encodeFunctionInput('transfer', [
                TEST_ACCOUNTS_TRANSACTION_TRANSACTION_RECEIVER_ADDRESS,
                Units.parseEther('1').bi
            ])
            .toString()
    };

    const transferTransactionBody: Omit<TransactionBody, 'gas' | 'nonce'> = {
        clauses: [transfer1VTHOClause],
        chainTag: networkInfo.solo.chainTag,
        blockRef: networkInfo.solo.genesisBlock.id.slice(0, 18),
        expiration: 1000,
        gasPriceCoef: 128,
        dependsOn: null
    };

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
            HexUInt.of(TEST_ACCOUNTS_TRANSACTION_SENDER_PRIVATE_KEY).bytes
        ).encoded;
        const response = await SendTransaction.of(tx).askTo(
            mockHttpClient(new TXID({ id: '0x123' }))
        );

        expect(response.response.toJSON()).toEqual(
            new TXID({ id: '0x123' }).toJSON()
        );
    });
});
