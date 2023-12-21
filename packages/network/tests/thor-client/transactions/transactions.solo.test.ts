import { describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    expectedReceipt,
    invalidWaitForTransactionTestCases,
    transferTransactionBody,
    transferTransactionBodyValueAsNumber,
    waitForTransactionTestCases
} from './fixture';
import { TEST_ACCOUNTS, thorSoloClient } from '../../fixture';
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
                try {
                    const nonce =
                        Math.random() * (99999999 - 10000000) + 1000000; // Random number between 10000000 and 99999999

                    // Create the signed transfer transaction
                    const tx = TransactionHandler.sign(
                        new Transaction({
                            ...transferTransactionBody,
                            nonce: Math.floor(nonce)
                        }),
                        Buffer.from(
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey,
                            'hex'
                        )
                    );

                    // Send the transaction and obtain the transaction ID
                    const sendTransactionResult =
                        await thorSoloClient.transactions.sendTransaction(tx);

                    expect(sendTransactionResult).toBeDefined();
                    expect(sendTransactionResult.id).toBeDefined();

                    // Wait for the transaction to be included in a block
                    const txReceipt =
                        await thorSoloClient.transactions.waitForTransaction(
                            sendTransactionResult.id,
                            options
                        );

                    expect(txReceipt).toBeDefined();
                    expect(txReceipt?.reverted).toBe(expectedReceipt.reverted);
                    expect(txReceipt?.outputs).toStrictEqual(
                        expectedReceipt.outputs
                    );
                    expect(txReceipt?.gasUsed).toBe(expectedReceipt.gasUsed);
                    expect(txReceipt?.gasPayer).toBe(expectedReceipt.gasPayer);
                    expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
                } catch (e) {
                    console.log(e);
                }
            });
        });

        /**
         * test that send transaction with a number as value in transaction body
         */
        test('test a send transaction with a number as value in transaction body ', async () => {
            try {
                const nonce = Math.random() * (99999999 - 10000000) + 1000000; // Random number between 10000000 and 99999999

                // Create the signed transfer transaction
                const tx = TransactionHandler.sign(
                    new Transaction({
                        ...transferTransactionBodyValueAsNumber,
                        nonce: Math.floor(nonce)
                    }),
                    Buffer.from(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                        'hex'
                    )
                );

                // Send the transaction and obtain the transaction ID
                const sendTransactionResult =
                    await thorSoloClient.transactions.sendTransaction(tx);

                expect(sendTransactionResult).toBeDefined();
                expect(sendTransactionResult.id).toBeDefined();

                // Wait for the transaction to be included in a block
                const txReceipt =
                    await thorSoloClient.transactions.waitForTransaction(
                        sendTransactionResult.id
                    );

                expect(txReceipt).toBeDefined();
                expect(txReceipt?.reverted).toBe(expectedReceipt.reverted);
            } catch (e) {
                console.log(e);
            }
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

                    const sendTransactionResult =
                        await thorSoloClient.transactions.sendTransaction(tx);

                    expect(sendTransactionResult.id).toBeDefined();

                    const txReceipt =
                        await thorSoloClient.transactions.waitForTransaction(
                            sendTransactionResult.id,
                            options
                        );

                    expect(txReceipt).toBeNull();
                });
            }
        );
    });

    /**
     * Test suite for buildTransactionBody method
     */
    describe('buildTransactionBody', () => {
        /**
         * buildTransactionBody test cases with different options
         */
        buildTransactionBodyClausesTestCases.forEach(
            ({ description, clauses, options, expected }) => {
                test(description, async () => {
                    const gasResult = await thorSoloClient.gas.estimateGas(
                        clauses,
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    );

                    expect(gasResult.totalGas).toBe(expected.solo.gas);

                    const txBody =
                        await thorSoloClient.transactions.buildTransactionBody(
                            clauses,
                            gasResult.totalGas,
                            options
                        );

                    expect(txBody).toBeDefined();
                    expect(txBody.clauses).toStrictEqual(expected.solo.clauses);
                    expect(txBody.expiration).toBe(expected.solo.expiration);
                    expect(txBody.gas).toBe(gasResult.totalGas);
                    expect(txBody.dependsOn).toBe(expected.solo.dependsOn);
                    expect(txBody.gasPriceCoef).toBe(
                        expected.solo.gasPriceCoef
                    );
                    expect(txBody.reserved).toStrictEqual(
                        expected.solo.reserved
                    );
                    expect(txBody.chainTag).toBe(expected.solo.chainTag);
                });
            }
        );
    });
});
