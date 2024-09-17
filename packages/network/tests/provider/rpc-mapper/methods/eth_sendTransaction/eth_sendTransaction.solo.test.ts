import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR
} from '../../../../fixture';
import {
    ProviderInternalBaseWallet,
    RPC_METHODS,
    THOR_SOLO_ACCOUNTS,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import {
    delegatorPrivateKeyFixture,
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
} from './fixture';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { Secp256k1 } from '@vechain/sdk-core';

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
    let providerWithDelegator: VeChainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(THOR_SOLO_URL);

        // Init provider
        provider = new VeChainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET
        );

        // Init provider with delegator
        // @NOTE due to the fact we are testing on thor-solo, we can delegate ONLY with a private key!
        providerWithDelegator = new VeChainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR({
                delegatorPrivateKey: delegatorPrivateKeyFixture
            }),
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
                        ? providerWithDelegator
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
            const from = THOR_SOLO_ACCOUNTS[18].address;
            const to = THOR_SOLO_ACCOUNTS[19].address;
            // Get the balance of the sender and the receiver before sending the transaction
            const balanceSenderBefore = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [from, 'latest']
            })) as string;
            const balanceReceiverBefore = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [to, 'latest']
            })) as string;

            // Send a transaction
            const transaction = (await provider.request({
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
            const balanceSenderAfter = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [from, 'latest']
            })) as string;
            const balanceReceiverAfter = (await provider.request({
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
                        privateKey: Buffer.from(
                            THOR_SOLO_ACCOUNTS[0].privateKey,
                            'hex'
                        ),
                        publicKey: Buffer.from(
                            Secp256k1.derivePublicKey(
                                Buffer.from(
                                    THOR_SOLO_ACCOUNTS[0].privateKey,
                                    'hex'
                                )
                            )
                        ),
                        address: THOR_SOLO_ACCOUNTS[0].address
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
    });
});
