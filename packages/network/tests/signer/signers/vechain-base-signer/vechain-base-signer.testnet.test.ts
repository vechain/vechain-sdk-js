import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    ThorClient,
    VechainBaseSigner,
    VechainProvider
} from '../../../../src';
import {
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    testnetUrl,
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR
} from '../../../fixture';
import {
    addressUtils,
    clauseBuilder,
    coder,
    type FunctionFragment,
    TransactionHandler
} from '../../../../../core';
import { signTransactionTestCases } from './fixture';

/**
 * Vechain base signer tests - testnet
 *
 * @group integration/signers/vechain-base-signer-testnet
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
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * Positive case tests
     */
    describe('Positive case - Signature', () => {
        /**
         * Should be able to sign transaction NOT delegated
         */
        test('Should be able to sign transaction - NOT DELEGATED CASES', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (!fixture.isDelegated) {
                    // Init the signer
                    const signer = new VechainBaseSigner(
                        Buffer.from(fixture.origin.privateKey, 'hex'),
                        new VechainProvider(
                            thorClient,
                            THOR_SOLO_ACCOUNTS_BASE_WALLET,
                            false
                        )
                    );

                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction({
                        from: fixture.origin.address
                    });

                    expect(signedTransaction).toBeDefined();
                }
            }
        });

        /**
         * Should be able to sign transaction delegated
         */
        test('Should be able to sign transaction - DELEGATED CASES', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (fixture.isDelegated) {
                    // Init the signer
                    const signer = new VechainBaseSigner(
                        Buffer.from(fixture.origin.privateKey, 'hex'),
                        new VechainProvider(
                            thorClient,
                            THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR(
                                fixture.options
                            ),
                            true
                        )
                    );

                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction({
                        from: fixture.origin.address
                    });

                    expect(signedTransaction).toBeDefined();
                }
            }
        }, 8000);
    });

    /**
     * Test suite for signTransaction using build transaction flow.
     * Test retro compatibility with thorClient signing flow.
     */
    describe('signTransactionTestCases', () => {
        /**
         * Correct test cases
         */
        signTransactionTestCases.testnet.correct.forEach(
            ({ description, origin, options, isDelegated, expected }) => {
                test(
                    description,
                    async () => {
                        const thorClient = ThorClient.fromUrl(testnetUrl);

                        const sampleClause = clauseBuilder.functionInteraction(
                            TESTING_CONTRACT_ADDRESS,
                            coder
                                .createInterface(TESTING_CONTRACT_ABI)
                                .getFunction(
                                    'setStateVariable'
                                ) as FunctionFragment,
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
                        const signer = new VechainBaseSigner(
                            Buffer.from(origin.privateKey, 'hex'),
                            new VechainProvider(
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
    });

    describe('resolveName(name)', () => {
        test('Should be able to resolve an address by name', async () => {
            const signer = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                new VechainProvider(
                    thorClient,
                    THOR_SOLO_ACCOUNTS_BASE_WALLET,
                    false
                )
            );
            const address = await signer.resolveName('test-sdk.vet');
            expect(address).toBe('0x105199a26b10e55300CB71B46c5B5e867b7dF427');
        });

        test('Should resolve to null for unknown names', async () => {
            const signer = new VechainBaseSigner(
                Buffer.from(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    'hex'
                ),
                new VechainProvider(
                    thorClient,
                    THOR_SOLO_ACCOUNTS_BASE_WALLET,
                    false
                )
            );
            const address = await signer.resolveName('unknown.test-sdk.vet');
            expect(address).toBe(null);
        });
    });
});
