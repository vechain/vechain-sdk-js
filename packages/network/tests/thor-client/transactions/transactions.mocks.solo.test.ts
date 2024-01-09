import { jest, describe, test, expect } from '@jest/globals';
import { ThorClient } from '../../../src';
import { transferTransactionBody } from './fixture';
import { soloNetwork, TEST_ACCOUNTS } from '../../fixture';
import { TransactionBodyError } from '@vechain/vechain-sdk-errors';

/**
 * Transactions module tests with mocks.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('buildTransactionBody with mocks', () => {
    test('Should throw error when genesis block is not found', async () => {
        const thorSoloClient = new ThorClient(soloNetwork);

        // Mock the getBlock method to return null
        jest.spyOn(thorSoloClient.blocks, 'getBlock').mockResolvedValue(null);

        const gas = await thorSoloClient.gas.estimateGas(
            [transferTransactionBody.clauses[0]],
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
        );

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                gas.totalGas
            )
        ).rejects.toThrowError(TransactionBodyError);
    });

    test('Should throw error when gest block is not found', async () => {
        const thorSoloClient = new ThorClient(soloNetwork);

        // Mock the getBestBlock method to return null
        jest.spyOn(thorSoloClient.blocks, 'getBestBlock').mockResolvedValue(
            null
        );

        const gas = await thorSoloClient.gas.estimateGas(
            [transferTransactionBody.clauses[0]],
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
        );

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                gas.totalGas
            )
        ).rejects.toThrowError(TransactionBodyError);
    });
});
