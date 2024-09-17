import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import {
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR
} from '../../../../fixture';
import {
    delegatorPrivateKeyFixture,
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
} from '../eth_sendTransaction/fixture';
import { Hex } from '@vechain/sdk-core';
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
    let providerWithDelegator: VeChainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);

        // Init provider
        // @NOTE: Since we are testing the signature, we can use SOLO accounts with testnet!
        provider = new VeChainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET
        );

        // Init provider with delegator
        // @NOTE due to the fact we are testing on thor-solo, we can delegate ONLY with a private key!
        // @NOTE: Since we are testing the signature, we can use SOLO accounts with testnet!
        providerWithDelegator = new VeChainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR({
                delegatorPrivateKey: delegatorPrivateKeyFixture
            }),
            true
        );
    });

    /**
     * eth_signTransaction RPC call tests - Positive cases
     */
    describe('eth_signTransaction - Positive cases', () => {
        /**
         * Should be able to sign transactions
         */
        test('Should be able to sign transactions', async () => {
            // Sign with the delegator OR not
            for (const delegated of [true, false]) {
                // Value field of the transaction objects to sign
                for (const value of ['0x111', '0x222', '0x333']) {
                    // Get the provider to use depending on delegated or not
                    const providerToUse = delegated
                        ? providerWithDelegator
                        : provider;

                    // Send a transaction
                    const signedTransaction = (await providerToUse.request({
                        method: RPC_METHODS.eth_signTransaction,
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

                    // Signed transaction should be a hex string
                    expect(Hex.isValid0x(signedTransaction)).toBe(true);
                }
            }
        }, 8000);
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
