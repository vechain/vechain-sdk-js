import { describe, expect, jest, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { transactionNonces, transferTransactionBody } from './fixture';
import { TEST_ACCOUNTS } from '../../fixture';
import { InvalidTransactionField } from '@vechain/sdk-errors';
import { retryOperation } from '../../test-utils';

/**
 * Transactions module tests with mocks.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('buildTransactionBody with mocks', () => {
    test('Should throw error when genesis block is not found', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

        // Mock the getBlock method to return null
        jest.spyOn(
            thorSoloClient.blocks,
            'getBlockCompressed'
        ).mockResolvedValue(null);

        const gas = await retryOperation(
            async () =>
                await thorSoloClient.transactions.estimateGas(
                    [transferTransactionBody.clauses[0]],
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                )
        );

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                gas.totalGas
            )
        ).rejects.toThrowError(InvalidTransactionField);
    });

    test('Should throw error when get block is not found', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

        // Mock the getBestBlock method to return null
        jest.spyOn(
            thorSoloClient.blocks,
            'getBestBlockCompressed'
        ).mockResolvedValue(null);

        const gas = await retryOperation(
            async () =>
                await thorSoloClient.transactions.estimateGas(
                    [transferTransactionBody.clauses[0]],
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                )
        );

        await expect(
            thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                gas.totalGas
            )
        ).rejects.toThrowError(InvalidTransactionField);
    });

    test('Should succeed when options are set', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

        const blockRef =
            (await thorSoloClient.blocks.getBestBlockRef()) as string;

        const gas = await retryOperation(
            async () =>
                await thorSoloClient.transactions.estimateGas(
                    [transferTransactionBody.clauses[0]],
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                )
        );

        const options = {
            blockRef,
            chainTag: 256,
            dependsOn:
                '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f', // Any valid tx id
            expiration: 1000,
            gasPriceCoef: 255,
            isDelegated: true,
            nonce: transactionNonces
                .sendTransactionWithANumberAsValueInTransactionBody[0]
        };

        const transactionBody =
            await thorSoloClient.transactions.buildTransactionBody(
                [transferTransactionBody.clauses[0]],
                gas.totalGas,
                options
            );
        expect(transactionBody.blockRef).toStrictEqual(options.blockRef);
        expect(transactionBody.chainTag).toStrictEqual(options.chainTag);
        expect(transactionBody.dependsOn).toStrictEqual(options.dependsOn);
        expect(transactionBody.expiration).toStrictEqual(options.expiration);
        expect(transactionBody.gasPriceCoef).toStrictEqual(
            options.gasPriceCoef
        );
        expect(transactionBody.nonce).toStrictEqual(options.nonce);
        expect(transactionBody.reserved).toStrictEqual({ features: 1 });
    });
});
