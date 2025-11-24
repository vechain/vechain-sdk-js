import { beforeEach, describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS } from '../../fixture';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { sendTransactionErrors, simulateTransaction } from './fixture-thorest';
import { InvalidDataType, stringifyData } from '@vechain/sdk-errors';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { retryOperation } from '../../test-utils';

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
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
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
                const latestBlock = await retryOperation(
                    async () =>
                        await thorSoloClient.blocks.getBestBlockCompressed()
                );

                // Estimate the gas required for the transfer transaction
                const gasResult = await retryOperation(
                    async () =>
                        await thorSoloClient.transactions.estimateGas(
                            testCase.transaction.clauses,
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                        )
                );

                const chainTagId = await thorSoloClient.nodes.getChaintag();

                if (!chainTagId) {
                    throw new Error('Chain tag not found');
                }
                // Create transactions
                const transactionBody = {
                    chainTag: chainTagId,
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
                    chainTag: chainTagId,
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
                const rawNormalSigned = Transaction.of(transactionBody).sign(
                    HexUInt.of(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
                    ).bytes
                ).encoded;

                const rawDelegatedSigned = Transaction.of(
                    delegatedTransactionBody
                ).signAsSenderAndGasPayer(
                    HexUInt.of(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
                    ).bytes,
                    HexUInt.of(TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey)
                        .bytes
                ).encoded;

                // 2 - Send transaction
                for (const raw of [rawNormalSigned, rawDelegatedSigned]) {
                    const send = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.sendRawTransaction(
                                HexUInt.of(raw).toString()
                            )
                    );
                    expect(send).toBeDefined();
                    expect(send).toHaveProperty('id');
                    expect(HexUInt.isValid0x(send.id)).toBe(true);

                    // 3 - Get transaction AND transaction receipt
                    const transaction = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.getTransaction(
                                send.id
                            )
                    );
                    const transactionReceipt = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.getTransactionReceipt(
                                send.id
                            )
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
                    const simulatedTx = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.simulateTransaction(
                                transaction.clauses,
                                {
                                    ...transaction.simulateTransactionOptions
                                }
                            )
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
                        expect(stringifyData(simulatedTx[i])).toStrictEqual(
                            stringifyData(expected.simulationResults[i])
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
                    const simulatedTx = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.simulateTransaction(
                                transaction.clauses,
                                {
                                    ...transaction.simulateTransactionOptions
                                }
                            )
                    );

                    expect(simulatedTx).toBeDefined();

                    expect(simulatedTx).toHaveLength(1);

                    expect(stringifyData(simulatedTx[0])).toStrictEqual(
                        stringifyData(expected.simulationResults[0])
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
                    const simulatedTx = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.simulateTransaction(
                                transaction.clauses
                            )
                    );

                    expect(simulatedTx).toBeDefined();

                    expect(simulatedTx).toHaveLength(1);

                    expect(stringifyData(simulatedTx[0])).toStrictEqual(
                        stringifyData(expected.simulationResults[0])
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
                    const simulatedTx = await retryOperation(
                        async () =>
                            await thorSoloClient.transactions.simulateTransaction(
                                transaction.clauses,
                                {
                                    ...transaction.simulateTransactionOptions
                                }
                            )
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
            ).rejects.toThrow(InvalidDataType);
        });
    });
});
