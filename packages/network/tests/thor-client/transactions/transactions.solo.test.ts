import { describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    expectedReceipt,
    invalidWaitForTransactionTestCases,
    transactionNonces,
    transfer1VTHOClause,
    transferTransactionBody,
    transferTransactionBodyValueAsNumber,
    waitForTransactionTestCases
} from './fixture';
import { soloUrl, TEST_ACCOUNTS } from '../../fixture';
import { Transaction, TransactionHandler } from '@vechain/sdk-core';
import { TransactionNotSignedError } from '@vechain/sdk-errors';
import { ThorClient } from '../../../src';

/**
 * Transactions module tests.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module', () => {
    // ThorClient instance for the Solo network
    const thorSoloClient = ThorClient.fromUrl(soloUrl);

    /**
     * Test suite for sendTransaction method
     * For further testing examples see tests/clients/thorest-client/transactions/*
     */
    describe('sendTransaction', () => {
        test("Should throw error if transaction isn't signed", async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await thorSoloClient.gas.estimateGas(
                [transfer1VTHOClause],
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            );

            // Create the unsigned transfer transaction
            const tx = new Transaction({
                ...transferTransactionBody,
                gas: gasResult.totalGas,
                nonce: transactionNonces
                    .shouldThrowErrorIfTransactionIsntSigned[0]
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
            test(
                description,
                async () => {
                    // Estimate the gas required for the transfer transaction
                    const gasResult = await thorSoloClient.gas.estimateGas(
                        [transfer1VTHOClause],
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    );

                    // Create the signed transfer transaction
                    const tx = TransactionHandler.sign(
                        {
                            ...transferTransactionBody,
                            gas: gasResult.totalGas,
                            nonce: options.nonce
                        },
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
                },
                10000
            );
        });

        /**
         * test that send transaction with a number as value in transaction body
         */
        test('test a send transaction with a number as value in transaction body ', async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await thorSoloClient.gas.estimateGas(
                [transfer1VTHOClause],
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            );

            // Create the signed transfer transaction
            const tx = TransactionHandler.sign(
                {
                    ...transferTransactionBodyValueAsNumber,
                    gas: gasResult.totalGas,
                    nonce: transactionNonces
                        .sendTransactionWithANumberAsValueInTransactionBody[0]
                },
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
        });

        /**
         * waitForTransaction test cases that should not return a transaction receipt
         */
        invalidWaitForTransactionTestCases.forEach(
            ({ description, options }) => {
                test(
                    description,
                    async () => {
                        // Estimate the gas required for the transfer transaction
                        const gasResult = await thorSoloClient.gas.estimateGas(
                            [transfer1VTHOClause],
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                        );

                        // Create the signed transfer transaction
                        const tx = TransactionHandler.sign(
                            {
                                ...transferTransactionBody,
                                gas: gasResult.totalGas,
                                nonce: options.nonce
                            },
                            Buffer.from(
                                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                    .privateKey,
                                'hex'
                            )
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
