import { beforeEach, describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, soloNetwork } from '../../fixture';
import { dataUtils, H0x, TransactionHandler } from '@vechain/sdk-core';
import { sendTransactionErrors, simulateTransaction } from './fixture-thorest';
import { InvalidDataTypeError } from '@vechain/sdk-errors';
import { ThorClient } from '../../../src';

/**
 * ThorClient class tests.
 *
 * @NOTE: This test suite run on solo network because it requires to send transactions.
 *
 * @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
    });

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
                    await thorSoloClient.blocks.getBestBlockCompressed();

                // Estimate the gas required for the transfer transaction
                const gasResult = await thorSoloClient.gas.estimateGas(
                    testCase.transaction.clauses,
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                );

                // Create transactions
                const transactionBody = {
                    chainTag: 0xf6,
                    blockRef:
                        latestBlock !== null
                            ? latestBlock.id.slice(0, 18)
                            : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas: gasResult.totalGas,
                    dependsOn: null,
                    nonce: 12345678
                };

                const delegatedTransactionBody = {
                    chainTag: 0xf6,
                    blockRef:
                        latestBlock !== null
                            ? latestBlock.id.slice(0, 18)
                            : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas: gasResult.totalGas,
                    dependsOn: null,
                    nonce: 12345678,
                    reserved: {
                        features: 1
                    }
                };

                // Normal signature and delegation signature
                const rawNormalSigned = TransactionHandler.sign(
                    transactionBody,
                    Buffer.from(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                        'hex'
                    )
                ).encoded;

                const rawDelegatedSigned = TransactionHandler.signWithDelegator(
                    delegatedTransactionBody,
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
                        await thorSoloClient.transactions.sendRawTransaction(
                            H0x.of(raw)
                        );
                    expect(send).toBeDefined();
                    expect(send).toHaveProperty('id');
                    expect(dataUtils.isHexString(send.id)).toBe(true);

                    // 3 - Get transaction AND transaction receipt
                    const transaction =
                        await thorSoloClient.transactions.getTransaction(
                            send.id
                        );
                    const transactionReceipt =
                        await thorSoloClient.transactions.getTransactionReceipt(
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
                    thorSoloClient.transactions.sendRawTransaction(
                        testCase.transaction.raw
                    )
                ).rejects.toThrow(testCase.expected);
            });
        });
    });

    /**
     * Test suite for transaction simulations
     */
    describe('simulateTransaction', () => {
        /**
         * Simulate transfer transactions
         */
        simulateTransaction.correct.transfer.forEach(
            ({ testName, transaction, expected }) => {
                test(testName, async () => {
                    const simulatedTx =
                        await thorSoloClient.transactions.simulateTransaction(
                            transaction.clauses,
                            {
                                ...transaction.simulateTransactionOptions
                            }
                        );

                    expect(simulatedTx).toBeDefined();
                    /**
                     * The result of the simulation tx is an array of simulation results.
                     * Each result represents the simulation of transaction clause.
                     */
                    expect(simulatedTx).toHaveLength(
                        transaction.clauses.length
                    );

                    /**
                     * Compare each simulation result with the expected result.
                     */
                    for (let i = 0; i < simulatedTx.length; i++) {
                        expect(JSON.stringify(simulatedTx[i])).toStrictEqual(
                            JSON.stringify(expected.simulationResults[i])
                        );
                    }
                });
            }
        );

        /**
         * Simulate smart contract call transactions
         */
        simulateTransaction.correct.smartContractCall.forEach(
            ({ testName, transaction, expected }) => {
                test(testName, async () => {
                    const simulatedTx =
                        await thorSoloClient.transactions.simulateTransaction(
                            transaction.clauses,
                            {
                                ...transaction.simulateTransactionOptions
                            }
                        );

                    expect(simulatedTx).toBeDefined();

                    expect(simulatedTx).toHaveLength(1);

                    expect(JSON.stringify(simulatedTx[0])).toStrictEqual(
                        JSON.stringify(expected.simulationResults[0])
                    );
                });
            }
        );

        /**
         * Simulate smart contract deploy transactions
         */
        simulateTransaction.correct.deployContract.forEach(
            ({ testName, transaction, expected }) => {
                test(testName, async () => {
                    const simulatedTx =
                        await thorSoloClient.transactions.simulateTransaction(
                            transaction.clauses
                        );

                    expect(simulatedTx).toBeDefined();

                    expect(simulatedTx).toHaveLength(1);

                    expect(JSON.stringify(simulatedTx[0])).toStrictEqual(
                        JSON.stringify(expected.simulationResults[0])
                    );
                });
            }
        );

        /**
         * Simulate transactions where an error is expected
         */
        simulateTransaction.errors.forEach(
            ({ testName, transaction, vmError }) => {
                test(testName, async () => {
                    const simulatedTx =
                        await thorSoloClient.transactions.simulateTransaction(
                            transaction.clauses,
                            {
                                ...transaction.simulateTransactionOptions
                            }
                        );

                    expect(simulatedTx).toBeDefined();
                    expect(simulatedTx).toHaveLength(1);
                    expect(simulatedTx[0].vmError).toStrictEqual(vmError);
                    expect(simulatedTx[0].reverted).toBe(true);
                    expect(simulatedTx[0].transfers).toHaveLength(0);
                    expect(simulatedTx[0].events).toHaveLength(0);
                    expect(simulatedTx[0].data).toStrictEqual('0x');
                });
            }
        );

        /**
         * Simulate transaction with invalid revision
         */
        test('simulateTransaction with invalid revision', async () => {
            await expect(
                thorSoloClient.transactions.simulateTransaction(
                    [
                        {
                            to: '0x',
                            data: '0x',
                            value: '0x0'
                        }
                    ],
                    { revision: 'invalid-revision' }
                )
            ).rejects.toThrow(InvalidDataTypeError);
        });
    });
});
