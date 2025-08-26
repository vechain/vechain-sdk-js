import { beforeEach, describe, expect, test } from '@jest/globals';
import { getUnusedAccount } from '../../../../fixture';
import {
    ProviderInternalBaseWallet,
    RPC_METHODS,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import {
    gasPayerPrivateKeyFixture,
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
} from './fixture';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { HexUInt, Secp256k1 } from '@vechain/sdk-core';

/**
 * RPC Mapper integration tests for 'eth_sendTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendTransaction
 */
describe('RPC Mapper - eth_sendTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Provider instance
     */
    let provider: VeChainProvider;
    let providerWithgasPayer: VeChainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);

        // Create wallet with the sender account that we'll use in the tests
        const senderAccount =
            THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE.sender;

        // Init provider with the same account used in the transactions
        provider = new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([
                {
                    privateKey: HexUInt.of(senderAccount.privateKey).bytes,
                    publicKey: Secp256k1.derivePublicKey(
                        HexUInt.of(senderAccount.privateKey).bytes
                    ),
                    address: senderAccount.address
                }
            ])
        );

        // Init provider with gasPayer
        // @NOTE due to the fact we are testing on thor-solo, we can delegate ONLY with a private key!
        providerWithgasPayer = new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet(
                [
                    {
                        privateKey: HexUInt.of(senderAccount.privateKey).bytes,
                        publicKey: Secp256k1.derivePublicKey(
                            HexUInt.of(senderAccount.privateKey).bytes
                        ),
                        address: senderAccount.address
                    }
                ],
                {
                    gasPayer: {
                        gasPayerPrivateKey: gasPayerPrivateKeyFixture
                    }
                }
            ),
            true
        );
    });

    /**
     * eth_sendTransaction RPC call tests - Positive cases
     */
    describe('eth_sendTransaction - Positive cases', () => {
        /**
         * Positive case 1 - Should be able to send a transaction (delegated or not)
         */
        [true, false].forEach((delegated) => {
            ['0x111', '0x222', '0x333'].forEach((value) => {
                test(`eth_sendTransaction - Should be able to send a transaction with value ${value} - ${delegated ? 'delegated case' : 'not delegated case'}`, async () => {
                    // Get the provider to use depending on delegated or not
                    const providerToUse = delegated
                        ? providerWithgasPayer
                        : provider;

                    // Get the balance of the sender and the receiver before sending the transaction
                    const balanceSenderBefore = (await providerToUse.request({
                        method: RPC_METHODS.eth_getBalance,
                        params: [
                            THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .sender.address,
                            'latest'
                        ]
                    })) as string;
                    const balanceReceiverBefore = (await providerToUse.request({
                        method: RPC_METHODS.eth_getBalance,
                        params: [
                            THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            'latest'
                        ]
                    })) as string;

                    // Send a transaction
                    const transaction = (await providerToUse.request({
                        method: RPC_METHODS.eth_sendTransaction,
                        params: [
                            {
                                from: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .sender.address,
                                to: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .receiver.address,
                                value
                            }
                        ]
                    })) as string;

                    // Wait for the transaction to be mined
                    const receipt =
                        await thorClient.transactions.waitForTransaction(
                            transaction
                        );
                    expect(receipt).toBeDefined();

                    // Get the balance of the sender and the receiver after sending the transaction
                    const balanceSenderAfter = (await providerToUse.request({
                        method: RPC_METHODS.eth_getBalance,
                        params: [
                            THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .sender.address,
                            'latest'
                        ]
                    })) as string;
                    const balanceReceiverAfter = (await providerToUse.request({
                        method: RPC_METHODS.eth_getBalance,
                        params: [
                            THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            'latest'
                        ]
                    })) as string;

                    // Compare the balances
                    expect(balanceSenderAfter).not.toEqual(balanceSenderBefore);
                    expect(balanceReceiverAfter).not.toEqual(
                        balanceReceiverBefore
                    );
                });
            });
        });

        /**
         * Positive case 2 - Should be able to send a transaction with undefined value
         */
        test('eth_sendTransaction - Should be able to send a transaction with value undefined', async () => {
            // Create new accounts for this test
            const fromAccount = getUnusedAccount();
            const from = fromAccount.address;
            const to = getUnusedAccount().address;

            // Create a specific provider with these accounts in its wallet
            const testProvider = new VeChainProvider(
                thorClient,
                new ProviderInternalBaseWallet([
                    {
                        privateKey: HexUInt.of(fromAccount.privateKey).bytes,
                        publicKey: Secp256k1.derivePublicKey(
                            HexUInt.of(fromAccount.privateKey).bytes
                        ),
                        address: from
                    }
                ])
            );

            // Get the balance of the sender and the receiver before sending the transaction
            const balanceSenderBefore = (await testProvider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [from, 'latest']
            })) as string;
            const balanceReceiverBefore = (await testProvider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [to, 'latest']
            })) as string;

            // Send a transaction
            const transaction = (await testProvider.request({
                method: RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from,
                        to
                    }
                ]
            })) as string;

            // Wait for the transaction to be mined
            const receipt =
                await thorClient.transactions.waitForTransaction(transaction);
            expect(receipt).toBeDefined();

            // Get the balance of the sender and the receiver after sending the transaction
            const balanceSenderAfter = (await testProvider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [from, 'latest']
            })) as string;
            const balanceReceiverAfter = (await testProvider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [to, 'latest']
            })) as string;

            // Compare the balances (they will remain the same)
            expect(balanceSenderAfter).toEqual(balanceSenderBefore);
            expect(balanceReceiverAfter).toEqual(balanceReceiverBefore);
        });

        /**
         * Positive case 2 - Should be able to send deploy a smart contract (undefined to field)
         */
        test('eth_sendTransaction - Should be able to send deploy a smart contract', async () => {
            // Send a transaction with to field as undefined
            const transaction = (await provider.request({
                method: RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .sender.address
                    }
                ]
            })) as string;

            // Wait for the transaction to be mined
            const receipt =
                await thorClient.transactions.waitForTransaction(transaction);
            expect(receipt).toBeDefined();
        });
    });

    /**
     * eth_sendTransaction RPC call tests - Negative cases
     */
    describe('eth_sendTransaction - Negative cases', () => {
        /**
         * Negative case 1 - No from field in the transaction object
         */
        test('eth_sendTransaction - Should throw error if to field is not defined', async () => {
            // Send a transaction with to field as undefined
            await expect(
                async () =>
                    await provider.request({
                        method: RPC_METHODS.eth_sendTransaction,
                        params: [
                            // One object with no 'from' field
                            {}
                        ]
                    })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Negative case 2 - A provider without a wallet
         */
        test('eth_sendTransaction - Should throw error if the provider has not a wallet', async () => {
            // Empty wallet provider
            const providerWithoutWallet = new VeChainProvider(thorClient);

            // Send a transaction with invalid provider
            await expect(
                async () =>
                    await providerWithoutWallet.request({
                        method: RPC_METHODS.eth_sendTransaction,
                        params: [
                            {
                                from: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .receiver.address
                            }
                        ]
                    })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Negative case 3 - Signer private key not found
         */
        test('eth_sendTransaction - Should throw error if the provider has not a the signer private key into wallet', async () => {
            // Empty wallet provider
            const providerWithoutFromPrivateKey = new VeChainProvider(
                thorClient,
                new ProviderInternalBaseWallet([
                    {
                        privateKey: HexUInt.of(getUnusedAccount().privateKey)
                            .bytes,
                        publicKey: Secp256k1.derivePublicKey(
                            HexUInt.of(getUnusedAccount().privateKey).bytes
                        ),
                        address: getUnusedAccount().address
                    }
                ])
            );

            // Send a transaction with invalid provider
            await expect(
                async () =>
                    await providerWithoutFromPrivateKey.request({
                        method: RPC_METHODS.eth_sendTransaction,
                        params: [
                            {
                                from: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .sender.address
                            }
                        ]
                    })
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Negative case 4 - Invalid input
         */
        test('eth_sendTransaction - Should throw error if invalid input is given', async () => {
            // Send a transaction with to field as undefined
            await expect(
                async () =>
                    await provider.request({
                        method: RPC_METHODS.eth_sendTransaction,
                        params: ['INVALID']
                    })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Negative case 5 - Chain Id mismatch
         */
        test('eth_sendTransaction - Should throw error if chainId does not match', async () => {
            // Send a transaction with invalid chainId
            await expect(
                async () =>
                    await provider.request({
                        method: RPC_METHODS.eth_sendTransaction,
                        params: [
                            {
                                from: getUnusedAccount().address,
                                to: getUnusedAccount().address,
                                value: '0x1',
                                chainId: '0x123'
                            }
                        ]
                    })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
