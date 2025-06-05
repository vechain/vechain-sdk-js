import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider,
    ProviderInternalBaseWallet
} from '../../../../../src';
import { getUnusedAccount } from '../../../../fixture';
import {
    gasPayerPrivateKeyFixture,
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
} from '../eth_sendTransaction/fixture';
import { Hex, Secp256k1, HexUInt } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_signTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_signTransaction
 */
describe('RPC Mapper - eth_signTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Provider instance
     */
    let provider: VeChainProvider;
    let providerWithGasPayer: VeChainProvider;

    // Get an unused account, we will use the same account for the sender and the gas payer
    const unusedAccount = getUnusedAccount();

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);

        // Create a wallet with the sender account from the fixture
        const senderWallet = new ProviderInternalBaseWallet([
            {
                privateKey: HexUInt.of(unusedAccount.privateKey).bytes,
                publicKey: Secp256k1.derivePublicKey(
                    HexUInt.of(unusedAccount.privateKey).bytes
                ),
                address: unusedAccount.address
            }
        ]);

        // Init provider with the sender account
        provider = new VeChainProvider(thorClient, senderWallet);

        // Create a wallet with gas payer for the sender account
        const senderWalletWithGasPayer = new ProviderInternalBaseWallet(
            [
                {
                    privateKey: HexUInt.of(unusedAccount.privateKey).bytes,
                    publicKey: Secp256k1.derivePublicKey(
                        HexUInt.of(unusedAccount.privateKey).bytes
                    ),
                    address: unusedAccount.address
                }
            ],
            {
                gasPayer: {
                    gasPayerPrivateKey: gasPayerPrivateKeyFixture
                }
            }
        );

        // Init provider with gasPayer
        providerWithGasPayer = new VeChainProvider(
            thorClient,
            senderWalletWithGasPayer,
            true
        );
    });

    /**
     * eth_signTransaction RPC call tests - Positive cases
     */
    describe('eth_signTransaction - Positive cases', () => {
        const timeout = 15000; // 15 seconds
        /**
         * Should be able to sign transactions
         */
        test(
            'Should be able to sign transactions',
            async () => {
                // Sign with the gasPayer OR not
                for (const delegated of [true, false]) {
                    // Value field of the transaction objects to sign
                    for (const value of ['0x111', '0x222', '0x333']) {
                        // Get the provider to use depending on delegated or not
                        const providerToUse = delegated
                            ? providerWithGasPayer
                            : provider;

                        // Send a transaction
                        const signedTransaction = (await providerToUse.request({
                            method: RPC_METHODS.eth_signTransaction,
                            params: [
                                {
                                    from: unusedAccount.address,
                                    to: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                        .receiver.address,
                                    value
                                }
                            ]
                        })) as string;

                        // Signed transaction should be a hex string
                        expect(Hex.isValid0x(signedTransaction)).toBe(true);
                    }
                }
            },
            timeout
        );
    });

    /**
     * eth_signTransaction RPC call tests - Negative cases
     */
    describe('eth_signTransaction - Negative cases', () => {
        /**
         * Should be NOT able to sign transactions without a wallet/provider
         */
        test('Should be NOT able to sign transactions without a wallet/provider', async () => {
            // Provider without a wallet
            const providerWithoutWallet = new VeChainProvider(thorClient);

            // Sign without a wallet
            await expect(
                providerWithoutWallet.request({
                    method: RPC_METHODS.eth_signTransaction,
                    params: [
                        {
                            from: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .sender.address,
                            to: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            value: '0x111'
                        }
                    ]
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should be NOT able to sign transactions without the 'from' field
         */
        test('Should be NOT able to sign transactions without the "from" field', async () => {
            // Sign without the 'from' field
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTransaction,
                    params: [
                        {
                            to: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            value: '0x111'
                        }
                    ]
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should be NOT able to sign transactions with an invalid 'from' field
         */
        test('Should be NOT able to sign transactions with an invalid "from" field', async () => {
            // Sign with an invalid 'from' field
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTransaction,
                    params: [
                        {
                            from: 'INVALID_ADDRESS',
                            to: THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            value: '0x111'
                        }
                    ]
                })
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Should be NOT able to sign transactions with invalid input params
         */
        test('Should be NOT able to sign transactions with invalid input params', async () => {
            // Sign with invalid input params
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTransaction,
                    params: ['INVALID_PARAMS']
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
