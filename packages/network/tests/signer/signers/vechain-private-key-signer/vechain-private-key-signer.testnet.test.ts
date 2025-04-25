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
    ProviderInternalBaseWallet,
    signerUtils,
    TESTNET_URL,
    ThorClient,
    VeChainPrivateKeySigner,
    VeChainProvider
} from '../../../../src';
import {
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_GAS_PAYER
} from '../../../fixture';
import { signTransactionTestCases } from './fixture';

/**
 *VeChain base signer tests - testnet
 *
 * @group integration/network/signers/vechain-base-signer-testnet
 */
describe('VeChain base signer tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
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
                    const signer = new VeChainPrivateKeySigner(
                        HexUInt.of(fixture.origin.privateKey).bytes,
                        new VeChainProvider(
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
                    const signer = new VeChainPrivateKeySigner(
                        HexUInt.of(fixture.origin.privateKey).bytes,
                        new VeChainProvider(
                            thorClient,
                            THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_GAS_PAYER(
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

        /**
         * Should be able to request delegation URLs per transaction
         */
        test('Should be able to request delegation URLs per transaction', async () => {
            for (const fixture of signTransactionTestCases.testnet.correct) {
                if (fixture.isDelegated) {
                    const signer = new VeChainPrivateKeySigner(
                        HexUInt.of(fixture.origin.privateKey).bytes,
                        new VeChainProvider(
                            thorClient,
                            THOR_SOLO_ACCOUNTS_BASE_WALLET,
                            false
                        )
                    );

                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction({
                        from: fixture.origin.address,
                        delegationUrl: fixture.options.gasPayerServiceUrl
                    });

                    expect(signedTransaction).toBeDefined();
                }
            }
        });
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
    });

    describe('resolveName(name)', () => {
        test('Should be able to resolve an address by name', async () => {
            const signer = new VeChainPrivateKeySigner(
                HexUInt.of(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ).bytes,
                new VeChainProvider(
                    thorClient,
                    THOR_SOLO_ACCOUNTS_BASE_WALLET,
                    false
                )
            );
            const address = await signer.resolveName('test-sdk.vet');
            expect(address).toBe('0x105199a26b10e55300CB71B46c5B5e867b7dF427');
        });

        test('Should resolve to null for unknown names', async () => {
            const signer = new VeChainPrivateKeySigner(
                HexUInt.of(
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ).bytes,
                new VeChainProvider(
                    thorClient,
                    THOR_SOLO_ACCOUNTS_BASE_WALLET,
                    false
                )
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
