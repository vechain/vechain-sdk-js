/* eslint-disable sonarjs/no-selector-parameter */
import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ABIContract,
    Address,
    Clause,
    HexUInt,
    Transaction,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    THOR_SOLO_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '../../../../src';
import {
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    getUnusedAccount
} from '../../../fixture';
import { simulateTransaction } from '../../../thor-client/transactions/fixture-thorest';
import { signTransactionTestCases } from './fixture';
import { retryOperation } from '../../../test-utils';

/**
 * Helper function to conditionally run tests based on a condition
 */
const testIf = (condition: boolean, ...args: Parameters<typeof test>): void => {
    if (condition) {
        test(...args);
    } else {
        test.skip(...args);
    }
};

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
    let isGalacticaActive: boolean;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(async () => {
        thorClient = ThorClient.at(THOR_SOLO_URL);
        isGalacticaActive = await thorClient.forkDetector.detectGalactica();
    });

    /**
     * Test suite for signTransaction method
     */
    describe('signTransactionTestCases', () => {
        /**
         * Legacy transaction test cases (using gasPriceCoef)
         */
        describe('Legacy transactions', () => {
            const legacyTestCases =
                signTransactionTestCases.solo.correct.filter((testCase) =>
                    testCase.description.includes('legacy')
                );

            for (const {
                description,
                origin,
                options,
                params,
                isDelegated,
                expected
            } of legacyTestCases) {
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

                        const gasResult =
                            await thorClient.transactions.estimateGas(
                                [sampleClause],
                                origin.address
                            );

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                [sampleClause],
                                gasResult.totalGas,
                                {
                                    isDelegated,
                                    ...(params && {
                                        gasPriceCoef: params.gasPriceCoef
                                    })
                                }
                            );

                        // Get the signer and sign the transaction
                        const signer = new VeChainPrivateKeySigner(
                            HexUInt.of(origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                new ProviderInternalBaseWallet([], {
                                    gasPayer: options
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
                        const signedTx = Transaction.decode(
                            HexUInt.of(signedRawTx.slice(2)).bytes,
                            true
                        );

                        expect(signedTx).toBeDefined();
                        console.log(signedTx.body);
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
        });

        /**
         * EIP-1559 transaction test cases (using maxPriorityFeePerGas and maxFeePerGas)
         */
        describe('EIP-1559 transactions', () => {
            const eip1559TestCases =
                signTransactionTestCases.solo.correct.filter((testCase) =>
                    testCase.description.includes('EIP-1559')
                );

            for (const {
                description,
                origin,
                options,
                params,
                isDelegated,
                expected
            } of eip1559TestCases) {
                testIf(
                    isGalacticaActive,
                    description,
                    async () => {
                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'deposit'
                            ),
                            [123]
                        ) as TransactionClause;

                        const gasResult =
                            await thorClient.transactions.estimateGas(
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
                            HexUInt.of(origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                new ProviderInternalBaseWallet([], {
                                    gasPayer: options
                                }),
                                isDelegated
                            )
                        );

                        const txInput =
                            signerUtils.transactionBodyToTransactionRequestInput(
                                txBody,
                                origin.address
                            );

                        // Add EIP-1559 parameters
                        if (typeof params !== 'undefined') {
                            Object.assign(txInput, {
                                maxPriorityFeePerGas:
                                    params.maxPriorityFeePerGas,
                                maxFeePerGas: params.maxFeePerGas
                            });
                        }

                        const signedRawTx =
                            await signer.signTransaction(txInput);
                        const signedTx = Transaction.decode(
                            HexUInt.of(signedRawTx.slice(2)).bytes,
                            true
                        );

                        expect(signedTx).toBeDefined();
                        console.log(signedTx.body);
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
        });

        /**
         * Error cases - split by transaction type
         */
        describe('Error cases - Legacy transactions', () => {
            const legacyErrorCases =
                signTransactionTestCases.solo.incorrect.filter((testCase) =>
                    testCase.description.includes('legacy')
                );

            for (const {
                description,
                origin,
                options,
                expectedError
            } of legacyErrorCases) {
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
                            HexUInt.of(origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                new ProviderInternalBaseWallet([], {
                                    gasPayer: options
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
        });

        describe('Error cases - EIP-1559 transactions', () => {
            const eip1559ErrorCases =
                signTransactionTestCases.solo.incorrect.filter((testCase) =>
                    testCase.description.includes('EIP-1559')
                );

            for (const {
                description,
                origin,
                options,
                params,
                expectedError
            } of eip1559ErrorCases) {
                testIf(
                    isGalacticaActive,
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
                            HexUInt.of(origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                new ProviderInternalBaseWallet([], {
                                    gasPayer: options
                                }),
                                true
                            )
                        );

                        const txInput =
                            signerUtils.transactionBodyToTransactionRequestInput(
                                txBody,
                                origin.address
                            );

                        // Add EIP-1559 parameters
                        if (typeof params !== 'undefined') {
                            Object.assign(txInput, {
                                maxPriorityFeePerGas:
                                    params.maxPriorityFeePerGas,
                                maxFeePerGas: params.maxFeePerGas
                            });
                        }

                        await expect(
                            signer.signTransaction(txInput)
                        ).rejects.toThrowError(expectedError);
                    },
                    10000
                );
            }
        });
    });

    /**
     * Test suite for call function.
     * @note Take some test cases are the same as the signTransaction function
     */
    describe('call', () => {
        const testAccount = getUnusedAccount();

        /**
         * Test call function without clauses
         */
        test('call with no clauses transaction', async () => {
            const signer = new VeChainPrivateKeySigner(
                HexUInt.of(testAccount.privateKey).bytes,
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
                        HexUInt.of(
                            transaction.simulateTransactionOptions
                                .callerPrivateKey
                        ).bytes,
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
                        HexUInt.of(testAccount.privateKey).bytes,
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

            // Set gasPriceCoef for legacy transaction
            txBody.gasPriceCoef = 0;

            // Get the signer and sign the transaction
            const signer = new VeChainPrivateKeySigner(
                HexUInt.of(
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
                ).bytes,
                new VeChainProvider(thorClient)
            );

            const signedRawTx = await signer.signTransaction(
                signerUtils.transactionBodyToTransactionRequestInput(
                    txBody,
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                )
            );
            const signedTx = Transaction.decode(
                HexUInt.of(signedRawTx.slice(2)).bytes,
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
        }, 15000);

        testIf(
            isGalacticaActive,
            'perform a transaction with maxFeePerGas and maxPriorityFeePerGas',
            async () => {
                const sampleClause = Clause.callFunction(
                    Address.of(TESTING_CONTRACT_ADDRESS),
                    ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                        'deposit'
                    ),
                    [123]
                ) as TransactionClause;

                const gasResult = await retryOperation(async () => {
                    return await thorClient.transactions.estimateGas(
                        [sampleClause],
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    );
                });

                const txBody = await retryOperation(async () => {
                    return await thorClient.transactions.buildTransactionBody(
                        [sampleClause],
                        gasResult.totalGas
                    );
                });

                // Add dynamic fee parameters - use numeric values directly
                txBody.maxFeePerGas = 256; // Decimal value of 0x100
                txBody.maxPriorityFeePerGas = 80; // Decimal value of 0x50

                // Get the signer and sign the transaction
                const signer = new VeChainPrivateKeySigner(
                    HexUInt.of(
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
                    ).bytes,
                    new VeChainProvider(thorClient)
                );

                const signedRawTx = await retryOperation(async () => {
                    return await signer.signTransaction(
                        signerUtils.transactionBodyToTransactionRequestInput(
                            txBody,
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                        )
                    );
                });
                const signedTx = Transaction.decode(
                    HexUInt.of(signedRawTx.slice(2)).bytes,
                    true
                );

                expect(signedTx).toBeDefined();
                expect(signedTx.body.maxFeePerGas).toEqual(256);
                expect(signedTx.body.maxPriorityFeePerGas).toEqual(80);
                expect(signedTx.origin.toString()).toBe(
                    Address.checksum(
                        HexUInt.of(
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                        )
                    )
                );
                expect(signedTx.isSigned).toBe(true);
                expect(signedTx.signature).toBeDefined();
            },
            15000
        );
    });
});
