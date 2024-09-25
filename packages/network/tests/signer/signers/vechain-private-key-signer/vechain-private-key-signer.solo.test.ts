import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ABIContract,
    Address,
    Clause,
    HexUInt,
    type TransactionClause,
    TransactionHandler
} from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    THOR_SOLO_ACCOUNTS,
    THOR_SOLO_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '../../../../src';
import {
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../../fixture';
import { simulateTransaction } from '../../../thor-client/transactions/fixture-thorest';
import { signTransactionTestCases } from './fixture';

/**
 *VeChain base signer tests - solo
 *
 * @group integration/signers/vechain-base-signer-solo
 */
describe('VeChain base signer tests - solo', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(THOR_SOLO_URL);
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
                test(
                    description,
                    async () => {
                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'deposit'
                            ),
                            [123]
                        ) as TransactionClause;

                        const gasResult = await thorClient.gas.estimateGas(
                            [sampleClause],
                            origin.address
                        );

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                [sampleClause],
                                gasResult.totalGas,
                                {
                                    isDelegated
                                }
                            );

                        // Get the signer and sign the transaction
                        const signer = new VeChainPrivateKeySigner(
                            Buffer.from(origin.privateKey, 'hex'),
                            new VeChainProvider(
                                thorClient,
                                new ProviderInternalBaseWallet([], {
                                    delegator: options
                                }),
                                isDelegated
                            )
                        );

                        const signedRawTx = await signer.signTransaction(
                            signerUtils.transactionBodyToTransactionRequestInput(
                                txBody,
                                origin.address
                            )
                        );
                        const signedTx = TransactionHandler.decode(
                            Buffer.from(signedRawTx.slice(2), 'hex'),
                            true
                        );

                        expect(signedTx).toBeDefined();
                        expect(signedTx.body).toMatchObject(expected.body);
                        expect(signedTx.origin.toString()).toBe(
                            Address.checksum(HexUInt.of(origin.address))
                        );
                        expect(signedTx.isDelegated).toBe(isDelegated);
                        expect(signedTx.isSigned).toBe(true);
                        expect(signedTx.signature).toBeDefined();
                    },
                    8000
                );
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
                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'setStateVariable'
                            ),
                            [123]
                        ) as TransactionClause;

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                [sampleClause],
                                0
                            );

                        const signer = new VeChainPrivateKeySigner(
                            Buffer.from(origin.privateKey, 'hex'),
                            new VeChainProvider(
                                thorClient,
                                new ProviderInternalBaseWallet([], {
                                    delegator: options
                                }),
                                true
                            )
                        );

                        await expect(
                            signer.signTransaction(
                                signerUtils.transactionBodyToTransactionRequestInput(
                                    txBody,
                                    origin.address
                                )
                            )
                        ).rejects.toThrowError(expectedError);
                    },
                    10000
                );
            }
        );
    });

    /**
     * Test suite for call function.
     * @note Take some test cases are the same as the signTransaction function
     */
    describe('call', () => {
        /**
         * Test call function without clauses
         */
        test('call with no clauses transaction', async () => {
            const signer = new VeChainPrivateKeySigner(
                Buffer.from(THOR_SOLO_ACCOUNTS[0].privateKey, 'hex'),
                new VeChainProvider(
                    thorClient,
                    new ProviderInternalBaseWallet([]),
                    false
                )
            );

            const result = await signer.call({});
            expect(result).toBe('0x');
        });

        /**
         * Simulate transfer transactions
         */
        simulateTransaction.correct.transfer.forEach(
            ({ testName, transaction, expected }) => {
                test(testName, async () => {
                    const signer = new VeChainPrivateKeySigner(
                        Buffer.from(
                            transaction.simulateTransactionOptions
                                .callerPrivateKey,
                            'hex'
                        ),
                        new VeChainProvider(
                            thorClient,
                            new ProviderInternalBaseWallet([]),
                            false
                        )
                    );

                    const simulatedTx = await signer.call({
                        clauses: transaction.clauses
                    });

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
                    expect(simulatedTx).toStrictEqual(
                        expected.simulationResults[0].data
                    );
                });
            }
        );

        /**
         * Simulate smart contract call transactions
         */
        simulateTransaction.correct.smartContractCall.forEach(
            ({ testName, transaction, expected }) => {
                test(testName, async () => {
                    const signer = new VeChainPrivateKeySigner(
                        Buffer.from(THOR_SOLO_ACCOUNTS[0].privateKey, 'hex'),
                        new VeChainProvider(
                            thorClient,
                            new ProviderInternalBaseWallet([]),
                            false
                        )
                    );

                    const simulatedTx = await signer.call(
                        {
                            clauses: transaction.clauses
                        },
                        transaction.simulateTransactionOptions != null
                            ? transaction.simulateTransactionOptions.revision
                            : undefined
                    );

                    expect(simulatedTx).toBeDefined();
                    expect(simulatedTx).toBe(
                        expected.simulationResults[0].data
                    );
                });
            }
        );

        test('perform a transaction with custom gas', async () => {
            const sampleClause = Clause.callFunction(
                Address.of(TESTING_CONTRACT_ADDRESS),
                ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction('deposit'),
                [123]
            ) as TransactionClause;

            const txBody = await thorClient.transactions.buildTransactionBody(
                [sampleClause],
                6000000
            );

            // Get the signer and sign the transaction
            const signer = new VeChainPrivateKeySigner(
                Buffer.from(
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                    'hex'
                ),
                new VeChainProvider(thorClient)
            );

            const signedRawTx = await signer.signTransaction(
                signerUtils.transactionBodyToTransactionRequestInput(
                    txBody,
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                )
            );
            const signedTx = TransactionHandler.decode(
                Buffer.from(signedRawTx.slice(2), 'hex'),
                true
            );

            expect(signedTx).toBeDefined();
            expect(signedTx.body.gas).toEqual(6000000);
            expect(signedTx.origin.toString()).toBe(
                Address.checksum(
                    HexUInt.of(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    )
                )
            );
            expect(signedTx.isSigned).toBe(true);
            expect(signedTx.signature).toBeDefined();
        }, 8000);
    });
});
