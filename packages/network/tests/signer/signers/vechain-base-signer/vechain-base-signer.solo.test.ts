import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    ThorClient,
    VeChainBaseSigner,
    VeChainProvider
} from '../../../../src';
import {
    ALL_ACCOUNTS,
    soloUrl,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../../fixture';
import {
    addressUtils,
    clauseBuilder,
    coder,
    type FunctionFragment,
    TransactionHandler
} from '../../../../../core';
import { signTransactionTestCases } from './fixture';
import { simulateTransaction } from '../../../thor-client/transactions/fixture-thorest';

/**
 *VeChain base signer tests - solo
 *
 * @group integration/signers/vechain-base-signer-solo
 */
describe('Vechain base signer tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(soloUrl);
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
                        const sampleClause = clauseBuilder.functionInteraction(
                            TESTING_CONTRACT_ADDRESS,
                            coder
                                .createInterface(TESTING_CONTRACT_ABI)
                                .getFunction('deposit') as FunctionFragment,
                            [123]
                        );

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
                        const signer = new VeChainBaseSigner(
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
                        expect(signedTx.origin).toBe(
                            addressUtils.toERC55Checksum(origin.address)
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
                        const sampleClause = clauseBuilder.functionInteraction(
                            TESTING_CONTRACT_ADDRESS,
                            coder
                                .createInterface(TESTING_CONTRACT_ABI)
                                .getFunction(
                                    'setStateVariable'
                                ) as FunctionFragment,
                            [123]
                        );

                        const txBody =
                            await thorClient.transactions.buildTransactionBody(
                                [sampleClause],
                                0
                            );

                        const signer = new VeChainBaseSigner(
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
            const signer = new VeChainBaseSigner(
                Buffer.from(ALL_ACCOUNTS[0].privateKey, 'hex'),
                new VeChainProvider(
                    thorClient,
                    new ProviderInternalBaseWallet([]),
                    false
                )
            );

            const result = await signer.call({});
            expect(result).toBeDefined();
        });

        /**
         * Simulate transfer transactions
         */
        simulateTransaction.correct.transfer.forEach(
            ({ testName, transaction, expected }) => {
                test(testName, async () => {
                    const signer = new VeChainBaseSigner(
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
                    const signer = new VeChainBaseSigner(
                        Buffer.from(ALL_ACCOUNTS[0].privateKey, 'hex'),
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

                    expect(simulatedTx).toHaveLength(1);

                    expect(JSON.stringify(simulatedTx[0])).toStrictEqual(
                        JSON.stringify(expected.simulationResults[0])
                    );
                });
            }
        );
    });
});
