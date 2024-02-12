import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    buildTransactionBodyClausesTestCases,
    expectedReceipt,
    invalidWaitForTransactionTestCases,
    signTransactionTestCases,
    transactionNonces,
    transfer1VTHOClause,
    transferTransactionBody,
    transferTransactionBodyValueAsNumber,
    waitForTransactionTestCases
} from './fixture';
import {
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    soloNetwork,
    TESTING_CONTRACT_ADDRESS
} from '../../fixture';
import {
    Transaction,
    TransactionHandler,
    addressUtils,
    contract
} from '@vechain/vechain-sdk-core';
import { TransactionNotSignedError } from '@vechain/vechain-sdk-errors';
import { ThorClient } from '../../../src';

/**
 * Transactions module tests.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module', () => {
    // ThorClient instance for the Solo network
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
    });

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
            test(description, async () => {
                // Estimate the gas required for the transfer transaction
                const gasResult = await thorSoloClient.gas.estimateGas(
                    [transfer1VTHOClause],
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                );

                // Create the signed transfer transaction
                const tx = TransactionHandler.sign(
                    new Transaction({
                        ...transferTransactionBody,
                        gas: gasResult.totalGas,
                        nonce: options.nonce
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
            });
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
                new Transaction({
                    ...transferTransactionBodyValueAsNumber,
                    gas: gasResult.totalGas,
                    nonce: transactionNonces
                        .sendTransactionWithANumberAsValueInTransactionBody[0]
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
                            new Transaction({
                                ...transferTransactionBody,
                                gas: gasResult.totalGas,
                                nonce: options.nonce
                            }),
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

    /**
     * Test suite for signTransaction method
     */
    describe('signTransactionTestCases', () => {
        /**
         * signTransaction test cases with different options
         */
        signTransactionTestCases.solo.correct.forEach(
            ({ description, origin, options, isDelegated, expected }) => {
                test(description, async () => {
                    const sampleClause =
                        contract.clauseBuilder.functionInteraction(
                            TESTING_CONTRACT_ADDRESS,
                            TESTING_CONTRACT_ABI,
                            'deposit',
                            [123]
                        );

                    const gasResult = await thorSoloClient.gas.estimateGas(
                        [sampleClause],
                        origin.address
                    );

                    const txBody =
                        await thorSoloClient.transactions.buildTransactionBody(
                            [sampleClause],
                            gasResult.totalGas,
                            {
                                isDelegated
                            }
                        );

                    const signedTx =
                        await thorSoloClient.transactions.signTransaction(
                            txBody,
                            origin.privateKey,
                            options
                        );

                    expect(signedTx).toBeDefined();
                    expect(signedTx.body).toMatchObject(expected.body);
                    expect(signedTx.origin).toBe(
                        addressUtils.toChecksummed(origin.address)
                    );
                    expect(signedTx.isDelegated).toBe(isDelegated);
                    expect(signedTx.isSigned).toBe(true);
                    expect(signedTx.signature).toBeDefined();
                });
            }
        );

        /**
         * signTransaction test cases that should throw an error
         */
        signTransactionTestCases.solo.incorrect.forEach(
            ({ description, origin, options, expectedError }) => {
                test(
                    description,
                    async () => {
                        const sampleClause =
                            contract.clauseBuilder.functionInteraction(
                                TESTING_CONTRACT_ADDRESS,
                                TESTING_CONTRACT_ABI,
                                'setStateVariable',
                                [123]
                            );

                        const txBody =
                            await thorSoloClient.transactions.buildTransactionBody(
                                [sampleClause],
                                0
                            );

                        await expect(
                            thorSoloClient.transactions.signTransaction(
                                txBody,
                                origin.privateKey,
                                options
                            )
                        ).rejects.toThrow(expectedError);
                    },
                    10000
                );
            }
        );
    });
});
