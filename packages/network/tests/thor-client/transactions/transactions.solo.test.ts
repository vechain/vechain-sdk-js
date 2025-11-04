import { describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    expectedReceipt,
    invalidWaitForTransactionTestCases,
    transactionNonces,
    transfer1VTHOClause,
    waitForTransactionTestCases
} from './fixture';
import { TEST_ACCOUNTS } from '../../fixture';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { InvalidDataType } from '@vechain/sdk-errors';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { retryOperation } from '../../test-utils';

/**
 * Transactions module tests.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module', () => {
    // ThorClient instance for the Solo network
    const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

    /**
     * Test suite for sendTransaction method
     * For further testing examples see tests/clients/thorest-client/transactions/*
     */
    describe('sendTransaction', () => {
        test("Should throw error if transaction isn't signed", async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await retryOperation(
                async () =>
                    await thorSoloClient.transactions.estimateGas(
                        [transfer1VTHOClause],
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    )
            );

            const nonce =
                transactionNonces.shouldThrowErrorIfTransactionIsntSigned[0];

            const txBody =
                await thorSoloClient.transactions.buildTransactionBody(
                    [transfer1VTHOClause],
                    gasResult.totalGas,
                    { nonce }
                );

            // Create the unsigned transfer transaction
            const tx = Transaction.of(txBody);

            await expect(
                thorSoloClient.transactions.sendTransaction(tx)
            ).rejects.toThrow(InvalidDataType);
        }, 50000);
    });

    /**
     * Test suite for waitForTransaction method
     */
    describe('waitForTransaction', () => {
        /**
         * waitForTransaction test cases with different options
         */
        waitForTransactionTestCases.forEach(({ description, options }) => {
            test(
                description,
                async () => {
                    // Estimate the gas required for the transfer transaction
                    const gasResult = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.estimateGas(
                                [transfer1VTHOClause],
                                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                    .address
                            )
                    );
                    const nonce = options.nonce;

                    const txBody =
                        await thorSoloClient.transactions.buildTransactionBody(
                            [transfer1VTHOClause],
                            gasResult.totalGas,
                            { nonce }
                        );

                    const tx = Transaction.of(txBody).sign(
                        HexUInt.of(
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey
                        ).bytes
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
                    expect(txReceipt?.outputs).toEqual(expectedReceipt.outputs);
                    expect(txReceipt?.gasUsed).toBe(expectedReceipt.gasUsed);
                    expect(txReceipt?.gasPayer).toBe(expectedReceipt.gasPayer);
                    expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
                },
                10000
            );
        });

        /**
         * test that send transaction with a number as value in transaction body
         */
        test('test a send transaction with a number as value in transaction body ', async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await retryOperation(
                async () =>
                    await thorSoloClient.transactions.estimateGas(
                        [transfer1VTHOClause],
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    )
            );

            const nonce =
                transactionNonces
                    .sendTransactionWithANumberAsValueInTransactionBody[0];

            const txBody =
                await thorSoloClient.transactions.buildTransactionBody(
                    [transfer1VTHOClause],
                    gasResult.totalGas,
                    { nonce }
                );

            // Create the signed transfer transaction
            const tx = Transaction.of(txBody).sign(
                HexUInt.of(
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
                ).bytes
            );

            // Send the transaction and obtain the transaction ID
            const sendTransactionResult =
                await thorSoloClient.transactions.sendTransaction(tx);

            expect(sendTransactionResult).toBeDefined();
            expect(sendTransactionResult.id).toBeDefined();

            // Wait for the transaction to be included in a block
            const txReceipt = await sendTransactionResult.wait();

            expect(txReceipt).toBeDefined();
            expect(txReceipt?.reverted).toBe(expectedReceipt.reverted);
        });

        /**
         * Test that wait() method accepts timeout options
         */
        test('wait() should accept timeout options and pass them to waitForTransaction', async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await retryOperation(
                async () =>
                    await thorSoloClient.transactions.estimateGas(
                        [transfer1VTHOClause],
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    )
            );

            const nonce =
                transactionNonces.waitForTransactionTestCases[0] + 1000; // Use a unique nonce

            const txBody =
                await thorSoloClient.transactions.buildTransactionBody(
                    [transfer1VTHOClause],
                    gasResult.totalGas,
                    { nonce }
                );

            const tx = Transaction.of(txBody).sign(
                HexUInt.of(
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
                ).bytes
            );

            const sendTransactionResult =
                await thorSoloClient.transactions.sendTransaction(tx);

            // Wait with custom timeout options
            const txReceipt = await sendTransactionResult.wait({
                timeoutMs: 10000,
                intervalMs: 500
            });

            expect(txReceipt).toBeDefined();
            expect(txReceipt).not.toBeNull();
        }, 15000);

        /**
         * Test that wait() uses default timeout when no options are provided
         */
        test('wait() should use default timeout of 30 seconds when no options provided', async () => {
            // Use a non-existent transaction ID to test timeout
            const nonExistentTxId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            
            // Create a mock SendTransactionResult
            const mockSendResult = {
                id: nonExistentTxId,
                wait: async (options?: { timeoutMs?: number; intervalMs?: number }) => {
                    return await thorSoloClient.transactions.waitForTransaction(
                        nonExistentTxId,
                        options
                    );
                }
            };

            const startTime = Date.now();
            const receipt = await mockSendResult.wait(); // Should use default 30s timeout
            const endTime = Date.now();

            // Should return null due to timeout
            expect(receipt).toBeNull();
            
            // Should have taken approximately 30 seconds (with tolerance)
            expect(endTime - startTime).toBeGreaterThanOrEqual(29000);
            expect(endTime - startTime).toBeLessThan(35000);
        }, 40000);

        /**
         * Test that wait() times out correctly with custom timeout
         */
        test('wait() should timeout correctly with custom timeout options', async () => {
            const nonExistentTxId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            
            const mockSendResult = {
                id: nonExistentTxId,
                wait: async (options?: { timeoutMs?: number; intervalMs?: number }) => {
                    return await thorSoloClient.transactions.waitForTransaction(
                        nonExistentTxId,
                        options
                    );
                }
            };

            const startTime = Date.now();
            const receipt = await mockSendResult.wait({
                timeoutMs: 2000,
                intervalMs: 100
            });
            const endTime = Date.now();

            expect(receipt).toBeNull();
            expect(endTime - startTime).toBeGreaterThanOrEqual(1900);
            expect(endTime - startTime).toBeLessThan(3000);
        }, 5000);

        /**
         * waitForTransaction test cases that should not return a transaction receipt
         */
        invalidWaitForTransactionTestCases.forEach(
            ({ description, options }) => {
                test(
                    description,
                    async () => {
                        // Estimate the gas required for the transfer transaction
                        const gasResult = await retryOperation(
                            async () =>
                                await thorSoloClient.transactions.estimateGas(
                                    [transfer1VTHOClause],
                                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                        .address
                                )
                        );

                        const nonce = options.nonce;

                        const txBody =
                            await thorSoloClient.transactions.buildTransactionBody(
                                [transfer1VTHOClause],
                                gasResult.totalGas,
                                {
                                    nonce,
                                    dependsOn: options.dependsOn
                                }
                            );

                        // Create the signed transfer transaction
                        const tx = Transaction.of(txBody).sign(
                            HexUInt.of(
                                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                    .privateKey
                            ).bytes
                        );

                        const sendTransactionResult =
                            await thorSoloClient.transactions.sendTransaction(
                                tx
                            );

                        expect(sendTransactionResult.id).toBeDefined();

                        const txReceipt =
                            await thorSoloClient.transactions.waitForTransaction(
                                sendTransactionResult.id,
                                options
                            );

                        expect(txReceipt).toBeNull();
                    },
                    5000
                );
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
                    // Skip test if expected.solo is undefined
                    if (expected.solo === undefined) {
                        return;
                    }

                    const gasResult = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.estimateGas(
                                clauses,
                                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                    .address
                            )
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
                });
            }
        );
    });

    test('estimateGas', async () => {
        const gasResult = await retryOperation(async () => {
            return await thorSoloClient.transactions.estimateGas(
                [transfer1VTHOClause],
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            );
        });
        expect(gasResult).toBeDefined();
    }, 15000);
});
