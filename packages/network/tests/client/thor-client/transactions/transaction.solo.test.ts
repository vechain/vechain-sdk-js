import { describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, thorSoloClient } from '../../../fixture';
import {
    dataUtils,
    Transaction,
    TransactionHandler,
    TransactionUtils
} from '@vechain-sdk/core';
import { sendTransactionErrors } from './fixture';

/**
 * ThorClient class tests.
 *
 * @NOTE: This test suite run on solo network because it requires to send transactions.
 *
 * @group integration/client/thor/transactions
 */
describe('ThorClient - Transactions', () => {
    /**
     * sendTransaction tests
     */
    describe('sendTransaction', () => {
        /**
         * SendTransaction - correct cases
         */
        test('Should be able to send a transaction', async () => {
            // 1- Init transaction
            // Clauses
            const clauses = [
                {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: 1000000,
                    data: '0x'
                }
            ];

            // Get latest block
            const latestBlock = await thorSoloClient.blocks.getBlock('best');

            // Get gas @NOTE it is approximation. This part must be improved.
            const gas = 5000 + TransactionUtils.intrinsicGas(clauses) * 5;

            // Create transaction
            const transaction = new Transaction({
                chainTag: 0xf6,
                blockRef: latestBlock.id.slice(0, 18),
                expiration: 32,
                clauses,
                gasPriceCoef: 128,
                gas,
                dependsOn: null,
                nonce: 12345678
            });

            const raw = TransactionHandler.sign(
                transaction,
                Buffer.from(
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                    'hex'
                )
            ).encoded;

            // 2 - Send transaction
            const send = await thorSoloClient.transactions.sendTransaction(
                `0x${raw.toString('hex')}`
            );
            expect(send).toBeDefined();
            expect(send).toHaveProperty('id');
            expect(dataUtils.isHexString(send.id)).toBe(true);
        });

        /**
         * SendTransaction - error cases
         */
        sendTransactionErrors.forEach((testCase) => {
            test(testCase.testName, async () => {
                await expect(
                    thorSoloClient.transactions.sendTransaction(
                        testCase.transaction.raw
                    )
                ).rejects.toThrow(testCase.expected);
            });
        });
    });
});
