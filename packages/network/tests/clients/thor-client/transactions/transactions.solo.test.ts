import { describe, expect, test } from '@jest/globals';
import {
    estimateGasTestCases,
    expectedReceipt,
    invalidWaitForTransactionTestCases,
    transferTransactionBody,
    waitForTransactionTestCases
} from './fixture';
import { TEST_ACCOUNTS, thorSoloClient } from '../../../fixture';
import {
    Transaction,
    TransactionHandler
} from '@vechainfoundation/vechain-sdk-core';
import { TransactionNotSignedError } from '@vechainfoundation/vechain-sdk-errors';
/**
 * Transactions module tests.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('Transactions Module', () => {
    /**
     * Test suite for sendTransaction method
     * For further testing examples see tests/clients/thorest-client/transactions/*
     */
    describe('sendTransaction', () => {
        test("Should throw error if transaction isn't signed", async () => {
            const tx = new Transaction({
                ...transferTransactionBody,
                nonce: 12345678
            });

            await expect(
                thorSoloClient.transactions.sendTransaction(tx)
            ).rejects.toThrow(TransactionNotSignedError);
        });
    });

    /**
     * Test suite for waitForTransaction method
     */
    describe('waitForTransaction', () => {
        /**
         * waitForTransaction test cases with different options
         */
        waitForTransactionTestCases.forEach(({ description, options }) => {
            test(description, async () => {
                const nonce = Math.random() * (99999999 - 10000000) + 1000000; // Random number between 10000000 and 99999999

                // Create the signed transfer transaction
                const tx = TransactionHandler.sign(
                    new Transaction({
                        ...transferTransactionBody,
                        nonce: Math.floor(nonce)
                    }),
                    Buffer.from(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                        'hex'
                    )
                );

                // Send the transaction and obtain the transaction ID
                const txID =
                    await thorSoloClient.transactions.sendTransaction(tx);

                expect(txID).toBeDefined();

                // Wait for the transaction to be included in a block
                const txReceipt =
                    await thorSoloClient.transactions.waitForTransaction(
                        txID,
                        options
                    );

                expect(txReceipt).toBeDefined();
                expect(txReceipt?.reverted).toBe(expectedReceipt.reverted);
                expect(txReceipt?.outputs).toStrictEqual(
                    expectedReceipt.outputs
                );
                expect(txReceipt?.gasUsed).toBe(expectedReceipt.gasUsed);
                expect(txReceipt?.gasPayer).toBe(expectedReceipt.gasPayer);
                expect(txID).toBe(txReceipt?.meta.txID);
            });
        });

        /**
         * waitForTransaction test cases that should not return a transaction receipt
         */
        invalidWaitForTransactionTestCases.forEach(
            ({ description, options }) => {
                test(description, async () => {
                    const nonce = 12345678;

                    // Create the signed transfer transaction
                    const tx = TransactionHandler.sign(
                        new Transaction({
                            ...transferTransactionBody,
                            nonce
                        }),
                        Buffer.from(
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey,
                            'hex'
                        )
                    );

                    const txID =
                        await thorSoloClient.transactions.sendTransaction(tx);

                    expect(txID).toBeDefined();

                    const txReceipt =
                        await thorSoloClient.transactions.waitForTransaction(
                            txID,
                            options
                        );

                    expect(txReceipt).toBeNull();
                });
            }
        );
    });

    /**
     * Test suide for 'estimateGas' method
     */
    describe('estimateGas', () => {
        /**
         * Test cases where the transaction should revert
         */
        estimateGasTestCases.revert.forEach(
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const result =
                        await thorSoloClient.transactions.estimateGas(
                            clauses,
                            options
                        );

                    expect(result).toBeDefined();
                    expect(result).toStrictEqual(expected);
                });
            }
        );

        /**
         * Test cases where the transaction should succeed
         */
        estimateGasTestCases.success.forEach(
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const result =
                        await thorSoloClient.transactions.estimateGas(
                            clauses,
                            options
                        );

                    expect(result).toBeDefined();
                    expect(result).toStrictEqual(expected);
                });
            }
        );
    });

    /**
     * Test suite for 'getBaseGasPrice' method
     */
    describe('getBaseGasPrice', () => {
        test('Should return the base gas price of the Solo network', async () => {
            const baseGasPrice =
                await thorSoloClient.transactions.getBaseGasPrice();
            expect(baseGasPrice).toBe(
                '0x00000000000000000000000000000000000000000000000000038d7ea4c68000'
            );
            expect(Number(baseGasPrice)).toBe(10 ** 15); // 10^15 wei
        });
    });
});
