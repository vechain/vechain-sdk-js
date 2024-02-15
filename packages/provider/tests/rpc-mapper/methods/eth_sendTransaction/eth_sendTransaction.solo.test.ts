import { beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import {
    soloNetwork,
    TEST_ACCOUNTS_THOR_SOLO,
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR
} from '../../../fixture';
import {
    RPC_METHODS,
    type SendRawTransactionResultRPC,
    VechainProvider
} from '../../../../src';
import {
    delegatorPrivateKeyFixture,
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
} from './fixture';
import {
    InvalidDataTypeError,
    JSONRPCInvalidParams,
    ProviderRpcError
} from '@vechain/vechain-sdk-errors';
import { BaseWallet } from '@vechain/vechain-sdk-wallet';
import { secp256k1 } from '@vechain/vechain-sdk-core';

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
    let provider: VechainProvider;
    let providerWithDelegator: VechainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(soloNetwork);

        // Init provider
        provider = new VechainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET
        );

        // Init provider with delegator
        providerWithDelegator = new VechainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR({
                delegatorPrivatekey: delegatorPrivateKeyFixture
            })
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
                                value: '0x111'
                            }
                        ]
                    })) as SendRawTransactionResultRPC;

                    // Wait for the transaction to be mined
                    const receipt =
                        await thorClient.transactions.waitForTransaction(
                            transaction.result
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
            // Get the balance of the sender and the receiver before sending the transaction
            const balanceSenderBefore = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [
                    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE.sender
                        .address,
                    'latest'
                ]
            })) as string;
            const balanceReceiverBefore = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [
                    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE.receiver
                        .address,
                    'latest'
                ]
            })) as string;

            // Send a transaction
            const transaction = (await provider.request({
                method: RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .sender.address,
                        to: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .receiver.address
                    }
                ]
            })) as SendRawTransactionResultRPC;

            // Wait for the transaction to be mined
            const receipt = await thorClient.transactions.waitForTransaction(
                transaction.result
            );
            expect(receipt).toBeDefined();

            // Get the balance of the sender and the receiver after sending the transaction
            const balanceSenderAfter = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [
                    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE.sender
                        .address,
                    'latest'
                ]
            })) as string;
            const balanceReceiverAfter = (await provider.request({
                method: RPC_METHODS.eth_getBalance,
                params: [
                    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE.receiver
                        .address,
                    'latest'
                ]
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
            })) as SendRawTransactionResultRPC;

            // Wait for the transaction to be mined
            const receipt = await thorClient.transactions.waitForTransaction(
                transaction.result
            );
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
            const providerWithoutWallet = new VechainProvider(thorClient);

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
            const providerWithoutFromPrivateKey = new VechainProvider(
                thorClient,
                new BaseWallet([
                    {
                        privateKey: Buffer.from(
                            TEST_ACCOUNTS_THOR_SOLO[0].privateKey,
                            'hex'
                        ),
                        publicKey: secp256k1.derivePublicKey(
                            Buffer.from(
                                TEST_ACCOUNTS_THOR_SOLO[0].privateKey,
                                'hex'
                            )
                        ),
                        address: TEST_ACCOUNTS_THOR_SOLO[0].address
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
            ).rejects.toThrowError(ProviderRpcError);
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
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });
});
