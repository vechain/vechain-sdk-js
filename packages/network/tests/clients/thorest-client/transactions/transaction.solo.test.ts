import { describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, thorestSoloClient } from '../../../fixture';
import {
    dataUtils,
    Transaction,
    TransactionHandler,
    TransactionUtils
} from '@vechainfoundation/vechain-sdk-core';
import { sendTransactionErrors } from './fixture';

/**
 * ThorestClient class tests.
 *
 * @NOTE: This test suite run on solo network because it requires to send transactions.
 *
 * @group integration/clients/thorest-client/transactions
 */
describe('ThorestClient - Transactions', () => {
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
                    await thorestSoloClient.blocks.getBestBlock();

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
                    blockRef:
                        latestBlock !== null
                            ? latestBlock.id.slice(0, 18)
                            : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas,
                    dependsOn: null,
                    nonce: 12345678
                });

                const delegatedTransaction = new Transaction({
                    chainTag: 0xf6,
                    blockRef:
                        latestBlock !== null
                            ? latestBlock.id.slice(0, 18)
                            : '0x0',
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
                        await thorestSoloClient.transactions.sendTransaction(
                            `0x${raw.toString('hex')}`
                        );
                    expect(send).toBeDefined();
                    expect(send).toHaveProperty('id');
                    expect(dataUtils.isHexString(send.id)).toBe(true);

                    // 3 - Get transaction AND transaction receipt
                    const transaction =
                        await thorestSoloClient.transactions.getTransaction(
                            send.id
                        );
                    const transactionReceipt =
                        await thorestSoloClient.transactions.getTransactionReceipt(
                            send.id
                        );

                    expect(transaction).toBeDefined();
                    expect(transactionReceipt).toBeDefined();
                }
            });
        });

        /**
         * SendTransaction - error cases
         */
        sendTransactionErrors.errors.forEach((testCase) => {
            test(testCase.testName, async () => {
                await expect(
                    thorestSoloClient.transactions.sendTransaction(
                        testCase.transaction.raw
                    )
                ).rejects.toThrow(testCase.expected);
            });
        });
    });
});
