"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("../../../../fixture");
const src_1 = require("../../../../../src");
const fixture_2 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * RPC Mapper integration tests for 'eth_sendTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendTransaction
 */
(0, globals_1.describe)('RPC Mapper - eth_sendTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Provider instance
     */
    let provider;
    let providerWithgasPayer;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        // Create wallet with the sender account that we'll use in the tests
        const senderAccount = fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE.sender;
        // Init provider with the same account used in the transactions
        provider = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(senderAccount.privateKey).bytes,
                publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(senderAccount.privateKey).bytes),
                address: senderAccount.address
            }
        ]));
        // Init provider with gasPayer
        // @NOTE due to the fact we are testing on thor-solo, we can delegate ONLY with a private key!
        providerWithgasPayer = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(senderAccount.privateKey).bytes,
                publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(senderAccount.privateKey).bytes),
                address: senderAccount.address
            }
        ], {
            gasPayer: {
                gasPayerPrivateKey: fixture_2.gasPayerPrivateKeyFixture
            }
        }), true);
    });
    /**
     * eth_sendTransaction RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_sendTransaction - Positive cases', () => {
        /**
         * Positive case 1 - Should be able to send a transaction (delegated or not)
         */
        [true, false].forEach((delegated) => {
            ['0x111', '0x222', '0x333'].forEach((value) => {
                (0, globals_1.test)(`eth_sendTransaction - Should be able to send a transaction with value ${value} - ${delegated ? 'delegated case' : 'not delegated case'}`, async () => {
                    // Get the provider to use depending on delegated or not
                    const providerToUse = delegated
                        ? providerWithgasPayer
                        : provider;
                    // Get the balance of the sender and the receiver before sending the transaction
                    const balanceSenderBefore = (await providerToUse.request({
                        method: src_1.RPC_METHODS.eth_getBalance,
                        params: [
                            fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .sender.address,
                            'latest'
                        ]
                    }));
                    const balanceReceiverBefore = (await providerToUse.request({
                        method: src_1.RPC_METHODS.eth_getBalance,
                        params: [
                            fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            'latest'
                        ]
                    }));
                    // Send a transaction
                    const transaction = (await providerToUse.request({
                        method: src_1.RPC_METHODS.eth_sendTransaction,
                        params: [
                            {
                                from: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .sender.address,
                                to: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .receiver.address,
                                value
                            }
                        ]
                    }));
                    // Wait for the transaction to be mined
                    const receipt = await thorClient.transactions.waitForTransaction(transaction);
                    (0, globals_1.expect)(receipt).toBeDefined();
                    // Get the balance of the sender and the receiver after sending the transaction
                    const balanceSenderAfter = (await providerToUse.request({
                        method: src_1.RPC_METHODS.eth_getBalance,
                        params: [
                            fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .sender.address,
                            'latest'
                        ]
                    }));
                    const balanceReceiverAfter = (await providerToUse.request({
                        method: src_1.RPC_METHODS.eth_getBalance,
                        params: [
                            fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                .receiver.address,
                            'latest'
                        ]
                    }));
                    // Compare the balances
                    (0, globals_1.expect)(balanceSenderAfter).not.toEqual(balanceSenderBefore);
                    (0, globals_1.expect)(balanceReceiverAfter).not.toEqual(balanceReceiverBefore);
                });
            });
        });
        /**
         * Positive case 2 - Should be able to send a transaction with undefined value
         */
        (0, globals_1.test)('eth_sendTransaction - Should be able to send a transaction with value undefined', async () => {
            // Create new accounts for this test
            const fromAccount = (0, fixture_1.getUnusedAccount)();
            const from = fromAccount.address;
            const to = (0, fixture_1.getUnusedAccount)().address;
            // Create a specific provider with these accounts in its wallet
            const testProvider = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
                {
                    privateKey: sdk_core_1.HexUInt.of(fromAccount.privateKey).bytes,
                    publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(fromAccount.privateKey).bytes),
                    address: from
                }
            ]));
            // Get the balance of the sender and the receiver before sending the transaction
            const balanceSenderBefore = (await testProvider.request({
                method: src_1.RPC_METHODS.eth_getBalance,
                params: [from, 'latest']
            }));
            const balanceReceiverBefore = (await testProvider.request({
                method: src_1.RPC_METHODS.eth_getBalance,
                params: [to, 'latest']
            }));
            // Send a transaction
            const transaction = (await testProvider.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from,
                        to
                    }
                ]
            }));
            // Wait for the transaction to be mined
            const receipt = await thorClient.transactions.waitForTransaction(transaction);
            (0, globals_1.expect)(receipt).toBeDefined();
            // Get the balance of the sender and the receiver after sending the transaction
            const balanceSenderAfter = (await testProvider.request({
                method: src_1.RPC_METHODS.eth_getBalance,
                params: [from, 'latest']
            }));
            const balanceReceiverAfter = (await testProvider.request({
                method: src_1.RPC_METHODS.eth_getBalance,
                params: [to, 'latest']
            }));
            // Compare the balances (they will remain the same)
            (0, globals_1.expect)(balanceSenderAfter).toEqual(balanceSenderBefore);
            (0, globals_1.expect)(balanceReceiverAfter).toEqual(balanceReceiverBefore);
        });
        /**
         * Positive case 2 - Should be able to send deploy a smart contract (undefined to field)
         */
        (0, globals_1.test)('eth_sendTransaction - Should be able to send deploy a smart contract', async () => {
            // Send a transaction with to field as undefined
            const transaction = (await provider.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .sender.address
                    }
                ]
            }));
            // Wait for the transaction to be mined
            const receipt = await thorClient.transactions.waitForTransaction(transaction);
            (0, globals_1.expect)(receipt).toBeDefined();
        });
    });
    /**
     * eth_sendTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_sendTransaction - Negative cases', () => {
        /**
         * Negative case 1 - No from field in the transaction object
         */
        (0, globals_1.test)('eth_sendTransaction - Should throw error if to field is not defined', async () => {
            // Send a transaction with to field as undefined
            await (0, globals_1.expect)(async () => await provider.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: [
                    // One object with no 'from' field
                    {}
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Negative case 2 - A provider without a wallet
         */
        (0, globals_1.test)('eth_sendTransaction - Should throw error if the provider has not a wallet', async () => {
            // Empty wallet provider
            const providerWithoutWallet = new src_1.VeChainProvider(thorClient);
            // Send a transaction with invalid provider
            await (0, globals_1.expect)(async () => await providerWithoutWallet.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .receiver.address
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Negative case 3 - Signer private key not found
         */
        (0, globals_1.test)('eth_sendTransaction - Should throw error if the provider has not a the signer private key into wallet', async () => {
            // Empty wallet provider
            const providerWithoutFromPrivateKey = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
                {
                    privateKey: sdk_core_1.HexUInt.of((0, fixture_1.getUnusedAccount)().privateKey)
                        .bytes,
                    publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of((0, fixture_1.getUnusedAccount)().privateKey).bytes),
                    address: (0, fixture_1.getUnusedAccount)().address
                }
            ]));
            // Send a transaction with invalid provider
            await (0, globals_1.expect)(async () => await providerWithoutFromPrivateKey.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .sender.address
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Negative case 4 - Invalid input
         */
        (0, globals_1.test)('eth_sendTransaction - Should throw error if invalid input is given', async () => {
            // Send a transaction with to field as undefined
            await (0, globals_1.expect)(async () => await provider.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: ['INVALID']
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Negative case 5 - Chain Id mismatch
         */
        (0, globals_1.test)('eth_sendTransaction - Should throw error if chainId does not match', async () => {
            // Send a transaction with invalid chainId
            await (0, globals_1.expect)(async () => await provider.request({
                method: src_1.RPC_METHODS.eth_sendTransaction,
                params: [
                    {
                        from: (0, fixture_1.getUnusedAccount)().address,
                        to: (0, fixture_1.getUnusedAccount)().address,
                        value: '0x1',
                        chainId: '0x123'
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
