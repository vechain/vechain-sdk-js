import { jest, describe, test, expect } from '@jest/globals';
import { ThorClient, ThorestClient } from '../../../../src';
import { transferTransactionBody } from './fixture';
import { soloNetwork, TEST_ACCOUNTS } from '../../../fixture';
import { TransactionBodyError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Transactions module tests with mocks.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('buildTransactionBody with mocks', () => {
    test('Should throw error when genesis block is not found', async () => {
        const thorestSoloClient = new ThorestClient(soloNetwork);

        // Mock the getBlock method to return null
        jest.spyOn(thorestSoloClient.blocks, 'getBlock').mockResolvedValue(
            null
        );

        const thorSoloClient = new ThorClient(thorestSoloClient);

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )
        ).rejects.toThrowError(TransactionBodyError);
    });

    test('Should throw error when gest block is not found', async () => {
        const thorestSoloClient = new ThorestClient(soloNetwork);

        // Mock the getBestBlock method to return null
        jest.spyOn(thorestSoloClient.blocks, 'getBestBlock').mockResolvedValue(
            null
        );

        const thorSoloClient = new ThorClient(thorestSoloClient);

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )
        ).rejects.toThrowError(TransactionBodyError);
    });
});
