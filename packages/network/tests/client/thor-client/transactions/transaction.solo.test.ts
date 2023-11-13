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
        sendTransactionErrors.correct.forEach((testCase) => {
            test(testCase.testName, async () => {
                // 1- Init transaction

                // Get latest block
                const latestBlock =
                    await thorSoloClient.blocks.getBlock('best');

                // Get gas @NOTE it is approximation. This part must be improved.
                const gas =
                    5000 +
                    TransactionUtils.intrinsicGas(
                        testCase.transaction.clauses
                    ) *
                        5;

                // Create transactions
                const transaction = new Transaction({
                    chainTag: 0xf6,
                    blockRef: latestBlock.id.slice(0, 18),
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas,
                    dependsOn: null,
                    nonce: 12345678
                });

                const delegatedTransaction = new Transaction({
                    chainTag: 0xf6,
                    blockRef: latestBlock.id.slice(0, 18),
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas,
                    dependsOn: null,
                    nonce: 12345678,
                    reserved: {
                        features: 1
                    }
                });

                // Normal signature and delegation signature
                const rawNormalSigned = TransactionHandler.sign(
                    transaction,
                    Buffer.from(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                        'hex'
                    )
                ).encoded;

                const rawDelegatedSigned = TransactionHandler.signWithDelegator(
                    delegatedTransaction,
                    Buffer.from(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                        'hex'
                    ),
                    Buffer.from(
                        TEST_ACCOUNTS.TRANSACTION.DELEGATOR.privateKey,
                        'hex'
                    )
                ).encoded;

                // 2 - Send transaction
                for (const raw of [rawNormalSigned, rawDelegatedSigned]) {
                    const send =
                        await thorSoloClient.transactions.sendTransaction(
                            `0x${raw.toString('hex')}`
                        );
                    expect(send).toBeDefined();
                    expect(send).toHaveProperty('id');
                    expect(dataUtils.isHexString(send.id)).toBe(true);
                }
            });
        });

        /**
         * SendTransaction - error cases
         */
        sendTransactionErrors.errors.forEach((testCase) => {
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
