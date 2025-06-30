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
    InvalidSecp256k1PrivateKey,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import {
    signerUtils,
    TESTNET_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '../../../../src';
import {
    getUnusedBaseWallet,
    getUnusedBaseWalletWithGasPayer,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../../fixture';
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
 *VeChain base signer tests - testnet
 *
 * @group integration/signers/vechain-base-signer-testnet
 */
describe('VeChain base signer tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let isGalacticaActive: boolean;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(async () => {
        thorClient = ThorClient.at(TESTNET_URL);
        isGalacticaActive = await thorClient.forkDetector.detectGalactica();
    });

    /**
     * Positive case tests
     */
    describe('Positive case - Signature', () => {
        /**
         * Legacy transaction tests (NOT delegated)
         */
        test('Should be able to sign legacy transaction - NOT DELEGATED CASES', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (
                    !fixture.isDelegated &&
                    fixture.description.includes('legacy')
                ) {
                    // Init the signer
                    const signer = new VeChainPrivateKeySigner(
                        HexUInt.of(fixture.origin.privateKey).bytes,
                        new VeChainProvider(
                            thorClient,
                            getUnusedBaseWallet(),
                            false
                        )
                    );

                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        gasPriceCoef: 0 // Ensure legacy transaction uses gasPriceCoef
                    };

                    // Sign the transaction
                    const signedTransaction =
                        await signer.signTransaction(txInput);

                    expect(signedTransaction).toBeDefined();
                }
            }
        });

        /**
         * EIP-1559 transaction tests (NOT delegated)
         */
        testIf(
            isGalacticaActive,
            'Should be able to sign EIP-1559 transaction - NOT DELEGATED CASES',
            async () => {
                for (const fixture of signTransactionTestCases.testnet
                    .correct) {
                    if (
                        !fixture.isDelegated &&
                        fixture.description.includes('EIP-1559')
                    ) {
                        // Init the signer
                        const signer = new VeChainPrivateKeySigner(
                            HexUInt.of(fixture.origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                getUnusedBaseWallet(),
                                false
                            )
                        );

                        // Prepare transaction input
                        const txInput = {
                            from: fixture.origin.address
                        };

                        // Add EIP-1559 parameters if present in fixture
                        if (typeof fixture.params !== 'undefined') {
                            Object.assign(txInput, {
                                maxPriorityFeePerGas:
                                    fixture.params.maxPriorityFeePerGas,
                                maxFeePerGas: fixture.params.maxFeePerGas
                            });
                        }

                        // Sign the transaction
                        const signedTransaction =
                            await signer.signTransaction(txInput);

                        expect(signedTransaction).toBeDefined();
                    }
                }
            }
        );

        /**
         * Legacy transaction tests (delegated)
         */
        test('Should be able to sign legacy transaction - DELEGATED CASES', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (
                    fixture.isDelegated &&
                    fixture.description.includes('legacy')
                ) {
                    // Init the signer
                    const signer = new VeChainPrivateKeySigner(
                        HexUInt.of(fixture.origin.privateKey).bytes,
                        new VeChainProvider(
                            thorClient,
                            getUnusedBaseWalletWithGasPayer(fixture.options),
                            true
                        )
                    );

                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        gasPriceCoef: 0 // Ensure legacy transaction uses gasPriceCoef
                    };

                    // Sign the transaction
                    const signedTransaction =
                        await signer.signTransaction(txInput);

                    expect(signedTransaction).toBeDefined();
                }
            }
        }, 15000);

        /**
         * EIP-1559 transaction tests (delegated)
         */
        testIf(
            isGalacticaActive,
            'Should be able to sign EIP-1559 transaction - DELEGATED CASES',
            async () => {
                for (const fixture of signTransactionTestCases.testnet
                    .correct) {
                    if (
                        fixture.isDelegated &&
                        fixture.description.includes('EIP-1559')
                    ) {
                        // Init the signer
                        const signer = new VeChainPrivateKeySigner(
                            HexUInt.of(fixture.origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                getUnusedBaseWallet(),
                                true
                            )
                        );

                        // Prepare transaction input
                        const txInput = {
                            from: fixture.origin.address
                        };

                        // Add EIP-1559 parameters if present in fixture
                        if (typeof fixture.params !== 'undefined') {
                            Object.assign(txInput, {
                                maxPriorityFeePerGas:
                                    fixture.params.maxPriorityFeePerGas,
                                maxFeePerGas: fixture.params.maxFeePerGas
                            });
                        }

                        // Sign the transaction with retry logic
                        const signedTransaction = await retryOperation(
                            async () => {
                                return await signer.signTransaction(txInput);
                            }
                        );

                        expect(signedTransaction).toBeDefined();
                    }
                }
            },
            15000
        );

        /**
         * Legacy transaction tests (delegation URL)
         */
        test('Should be able to request delegation URLs per legacy transaction', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (
                    fixture.isDelegated &&
                    fixture.description.includes('legacy')
                ) {
                    const signer = new VeChainPrivateKeySigner(
                        HexUInt.of(fixture.origin.privateKey).bytes,
                        new VeChainProvider(
                            thorClient,
                            getUnusedBaseWallet(),
                            false
                        )
                    );

                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        delegationUrl: fixture.options.gasPayerServiceUrl,
                        gasPriceCoef: 0 // Ensure legacy transaction uses gasPriceCoef
                    };

                    // Sign the transaction
                    const signedTransaction =
                        await signer.signTransaction(txInput);

                    expect(signedTransaction).toBeDefined();
                }
            }
        });

        /**
         * EIP-1559 transaction tests (delegation URL)
         */
        testIf(
            isGalacticaActive,
            'Should be able to request delegation URLs per EIP-1559 transaction',
            async () => {
                for (const fixture of signTransactionTestCases.testnet
                    .correct) {
                    if (
                        fixture.isDelegated &&
                        fixture.description.includes('EIP-1559')
                    ) {
                        const signer = new VeChainPrivateKeySigner(
                            HexUInt.of(fixture.origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                getUnusedBaseWallet(),
                                false
                            )
                        );

                        // Prepare transaction input
                        const txInput = {
                            from: fixture.origin.address,
                            delegationUrl: fixture.options.gasPayerServiceUrl
                        };

                        // Add EIP-1559 parameters if present in fixture
                        if (typeof fixture.params !== 'undefined') {
                            Object.assign(txInput, {
                                maxPriorityFeePerGas:
                                    fixture.params.maxPriorityFeePerGas,
                                maxFeePerGas: fixture.params.maxFeePerGas
                            });
                        }

                        // Sign the transaction
                        const signedTransaction =
                            await signer.signTransaction(txInput);

                        expect(signedTransaction).toBeDefined();
                    }
                }
            }
        );
    });

    /**
     * Test suite for signTransaction using build transaction flow.
     * Test retro compatibility with thorClient signing flow.
     */
    describe('signTransactionTestCases', () => {
        /**
         * Legacy transaction test cases (using gasPriceCoef)
         */
        describe('Legacy transactions', () => {
            const legacyTestCases =
                signTransactionTestCases.testnet.correct.filter((testCase) =>
                    testCase.description.includes('legacy')
                );

            for (const {
                description,
                origin,
                options,
                isDelegated,
                expected
            } of legacyTestCases) {
                test(
                    description,
                    async () => {
                        const thorClient = ThorClient.at(TESTNET_URL);

                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'setStateVariable'
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

                        // Ensure legacy transactions use gasPriceCoef
                        txBody.gasPriceCoef = 0;

                        // Get the signer and sign the transaction
                        const signer = new VeChainPrivateKeySigner(
                            HexUInt.of(origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                getUnusedBaseWalletWithGasPayer(options),
                                isDelegated
                            )
                        );

                        const txInput =
                            signerUtils.transactionBodyToTransactionRequestInput(
                                txBody,
                                origin.address
                            );

                        const signedRawTx =
                            await signer.signTransaction(txInput);
                        const signedTx = Transaction.decode(
                            HexUInt.of(signedRawTx.slice(2)).bytes,
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
                    15000
                );
            }
        });

        /**
         * EIP-1559 transaction test cases (using maxPriorityFeePerGas and maxFeePerGas)
         */
        describe('EIP-1559 transactions', () => {
            const eip1559TestCases =
                signTransactionTestCases.testnet.correct.filter((testCase) =>
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
                        const thorClient = ThorClient.at(TESTNET_URL);

                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'setStateVariable'
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
                                getUnusedBaseWalletWithGasPayer(options),
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
                        expect(signedTx.body).toMatchObject(expected.body);
                        expect(signedTx.origin.toString()).toBe(
                            Address.checksum(HexUInt.of(origin.address))
                        );
                        expect(signedTx.isDelegated).toBe(isDelegated);
                        expect(signedTx.isSigned).toBe(true);
                        expect(signedTx.signature).toBeDefined();
                    },
                    15000
                );
            }
        });

        describe('Error cases - EIP-1559 transactions', () => {
            const eip1559ErrorCases =
                signTransactionTestCases.testnet.incorrect.filter((testCase) =>
                    testCase.description.includes('EIP-1559')
                );

            for (const { description, origin, params } of eip1559ErrorCases) {
                testIf(
                    isGalacticaActive,
                    description,
                    async () => {
                        const thorClient = ThorClient.at(TESTNET_URL);

                        const sampleClause = Clause.callFunction(
                            Address.of(TESTING_CONTRACT_ADDRESS),
                            ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                                'setStateVariable'
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
                                    isDelegated: false
                                }
                            );

                        // Get the signer and sign the transaction
                        const signer = new VeChainPrivateKeySigner(
                            HexUInt.of(origin.privateKey).bytes,
                            new VeChainProvider(
                                thorClient,
                                getUnusedBaseWallet(),
                                false
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
                        expect(signedTx.isSigned).toBe(false);
                        expect(signedTx.signature).toBeUndefined();
                    },
                    15000
                );
            }
        });
    });

    /**
     * Test cases for gas fee parameters
     */
    describe('Gas fee parameters', () => {
        testIf(
            isGalacticaActive,
            'Should sign transaction with maxPriorityFeePerGas parameter',
            async () => {
                const thorClient = ThorClient.at(TESTNET_URL);
                const account =
                    signTransactionTestCases.testnet.correct[0].origin;

                const sampleClause = Clause.callFunction(
                    Address.of(TESTING_CONTRACT_ADDRESS),
                    ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                        'setStateVariable'
                    ),
                    [123]
                ) as TransactionClause;

                const gasResult = await thorClient.transactions.estimateGas(
                    [sampleClause],
                    account.address
                );

                const txBody =
                    await thorClient.transactions.buildTransactionBody(
                        [sampleClause],
                        gasResult.totalGas,
                        {
                            isDelegated: false
                        }
                    );

                const signer = new VeChainPrivateKeySigner(
                    HexUInt.of(account.privateKey).bytes,
                    new VeChainProvider(
                        thorClient,
                        getUnusedBaseWallet(),
                        false
                    )
                );

                const maxPriorityFeePerGas = '0x1000';
                const txInput = {
                    ...signerUtils.transactionBodyToTransactionRequestInput(
                        txBody,
                        account.address
                    ),
                    maxPriorityFeePerGas
                };

                const signedRawTx = await signer.signTransaction(txInput);
                const signedTx = Transaction.decode(
                    HexUInt.of(signedRawTx.slice(2)).bytes,
                    true
                );

                expect(signedTx).toBeDefined();
                expect(signedTx.isSigned).toBe(true);
                expect(signedTx.signature).toBeDefined();
            }
        );

        testIf(
            isGalacticaActive,
            'Should sign transaction with maxFeePerGas parameter',
            async () => {
                const thorClient = ThorClient.at(TESTNET_URL);
                const account =
                    signTransactionTestCases.testnet.correct[0].origin;

                const sampleClause = Clause.callFunction(
                    Address.of(TESTING_CONTRACT_ADDRESS),
                    ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                        'setStateVariable'
                    ),
                    [123]
                ) as TransactionClause;

                const gasResult = await thorClient.transactions.estimateGas(
                    [sampleClause],
                    account.address
                );

                const txBody =
                    await thorClient.transactions.buildTransactionBody(
                        [sampleClause],
                        gasResult.totalGas,
                        {
                            isDelegated: false
                        }
                    );

                const signer = new VeChainPrivateKeySigner(
                    HexUInt.of(account.privateKey).bytes,
                    new VeChainProvider(
                        thorClient,
                        getUnusedBaseWallet(),
                        false
                    )
                );

                const maxFeePerGas = '0x2000';
                const txInput = {
                    ...signerUtils.transactionBodyToTransactionRequestInput(
                        txBody,
                        account.address
                    ),
                    maxFeePerGas
                };

                const signedRawTx = await signer.signTransaction(txInput);
                const signedTx = Transaction.decode(
                    HexUInt.of(signedRawTx.slice(2)).bytes,
                    true
                );

                expect(signedTx).toBeDefined();
                expect(signedTx.isSigned).toBe(true);
                expect(signedTx.signature).toBeDefined();
            }
        );

        testIf(
            isGalacticaActive,
            'Should sign transaction with both maxPriorityFeePerGas and maxFeePerGas parameters',
            async () => {
                const thorClient = ThorClient.at(TESTNET_URL);
                const account =
                    signTransactionTestCases.testnet.correct[0].origin;

                const sampleClause = Clause.callFunction(
                    Address.of(TESTING_CONTRACT_ADDRESS),
                    ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                        'setStateVariable'
                    ),
                    [123]
                ) as TransactionClause;

                const gasResult = await thorClient.transactions.estimateGas(
                    [sampleClause],
                    account.address
                );

                const txBody =
                    await thorClient.transactions.buildTransactionBody(
                        [sampleClause],
                        gasResult.totalGas,
                        {
                            isDelegated: false
                        }
                    );

                const signer = new VeChainPrivateKeySigner(
                    HexUInt.of(account.privateKey).bytes,
                    new VeChainProvider(
                        thorClient,
                        getUnusedBaseWallet(),
                        false
                    )
                );

                const maxPriorityFeePerGas = '0x1000';
                const maxFeePerGas = '0x2000';
                const txInput = {
                    ...signerUtils.transactionBodyToTransactionRequestInput(
                        txBody,
                        account.address
                    ),
                    maxPriorityFeePerGas,
                    maxFeePerGas
                };

                const signedRawTx = await signer.signTransaction(txInput);
                const signedTx = Transaction.decode(
                    HexUInt.of(signedRawTx.slice(2)).bytes,
                    true
                );

                expect(signedTx).toBeDefined();
                expect(signedTx.isSigned).toBe(true);
                expect(signedTx.signature).toBeDefined();
            }
        );
    });

    describe('resolveName(name)', () => {
        test('Should be able to resolve an address by name', async () => {
            const signer = new VeChainPrivateKeySigner(
                HexUInt.of(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ).bytes,
                new VeChainProvider(thorClient, getUnusedBaseWallet(), false)
            );
            const address = await signer.resolveName('test-sdk.vet');
            expect(address).toBe('0x105199a26b10e55300CB71B46c5B5e867b7dF427');
        });

        test('Should resolve to null for unknown names', async () => {
            const signer = new VeChainPrivateKeySigner(
                HexUInt.of(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ).bytes,
                new VeChainProvider(thorClient, getUnusedBaseWallet(), false)
            );
            const address = await signer.resolveName('unknown.test-sdk.vet');
            expect(address).toBe(null);
        });
    });

    /**
     * Signer negative cases
     */
    describe('Negative cases', () => {
        /**
         * Wrong private key
         */
        test('Should throw an error when the private key is wrong', () => {
            expect(
                () => new VeChainPrivateKeySigner(HexUInt.of('10').bytes)
            ).toThrowError(InvalidSecp256k1PrivateKey);
        });

        /**
         * When thorClient / provider are not set, some function cannot be called
         */
        test('Signer without a provider should throw errors when call some functions', async () => {
            const noProviderSigner = new VeChainPrivateKeySigner(
                HexUInt.of(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ).bytes
            );

            // Impossible to call "populateTransaction" without a provider
            await expect(
                noProviderSigner.populateTransaction({})
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Impossible to call "estimateGas" without a provider
            await expect(noProviderSigner.estimateGas({})).rejects.toThrowError(
                JSONRPCInvalidParams
            );

            // Impossible to call "call" without a provider
            await expect(noProviderSigner.call({})).rejects.toThrowError(
                JSONRPCInvalidParams
            );

            // Impossible to call "sendTransaction" without a provider
            await expect(
                noProviderSigner.sendTransaction({})
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Impossible to call "signTransaction" without a provider
            await expect(
                noProviderSigner.signTransaction({})
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
