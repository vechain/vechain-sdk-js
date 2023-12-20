import { jest, describe, test, expect } from '@jest/globals';
import { ThorClient, ThorestClient } from '../../../../src';
import { transferTransactionBody } from './fixture';
import { soloNetwork } from '../../../fixture';
import { TransactionBodyError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Transactions module tests with mocks.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('buildTransactionBody with mocks', () => {
    test('Should throw error when genesis block is not found', async () => {
        const thorestSoloClient = new ThorestClient(soloNetwork);
        const thorSoloClient = new ThorClient(thorestSoloClient);

        // Mock the getBlock method to return null
        jest.spyOn(thorSoloClient.blocks, 'getBlock').mockResolvedValue(null);

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                0
            )
        ).rejects.toThrowError(TransactionBodyError);
    });

    test('Should throw error when gest block is not found', async () => {
        const thorestSoloClient = new ThorestClient(soloNetwork);
        const thorSoloClient = new ThorClient(thorestSoloClient);

        // Mock the getBestBlock method to return null
        jest.spyOn(thorSoloClient.blocks, 'getBestBlock').mockResolvedValue(
            null
        );

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                0
            )
        ).rejects.toThrowError(TransactionBodyError);
    });
});
