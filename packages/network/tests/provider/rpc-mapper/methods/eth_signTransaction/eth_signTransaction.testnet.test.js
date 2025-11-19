"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("../../../../fixture");
const fixture_2 = require("../eth_sendTransaction/fixture");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_signTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_signTransaction
 */
(0, globals_1.describe)('RPC Mapper - eth_signTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Provider instance
     */
    let provider;
    let providerWithGasPayer;
    // Get an unused account, we will use the same account for the sender and the gas payer
    const unusedAccount = (0, fixture_1.getUnusedAccount)();
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        // Create a wallet with the sender account from the fixture
        const senderWallet = new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(unusedAccount.privateKey).bytes,
                publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(unusedAccount.privateKey).bytes),
                address: unusedAccount.address
            }
        ]);
        // Init provider with the sender account
        provider = new src_1.VeChainProvider(thorClient, senderWallet);
        // Create a wallet with gas payer for the sender account
        const senderWalletWithGasPayer = new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(unusedAccount.privateKey).bytes,
                publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(unusedAccount.privateKey).bytes),
                address: unusedAccount.address
            }
        ], {
            gasPayer: {
                gasPayerPrivateKey: fixture_2.gasPayerPrivateKeyFixture
            }
        });
        // Init provider with gasPayer
        providerWithGasPayer = new src_1.VeChainProvider(thorClient, senderWalletWithGasPayer, true);
    });
    /**
     * eth_signTransaction RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_signTransaction - Positive cases', () => {
        const timeout = 30000; // 30 seconds
        /**
         * Should be able to sign transactions
         */
        (0, globals_1.test)('Should be able to sign transactions', async () => {
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
                        method: src_1.RPC_METHODS.eth_signTransaction,
                        params: [
                            {
                                from: unusedAccount.address,
                                to: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                                    .receiver.address,
                                value
                            }
                        ]
                    }));
                    // Signed transaction should be a hex string
                    (0, globals_1.expect)(sdk_core_1.Hex.isValid0x(signedTransaction)).toBe(true);
                }
            }
        }, timeout);
    });
    /**
     * eth_signTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_signTransaction - Negative cases', () => {
        /**
         * Should be NOT able to sign transactions without a wallet/provider
         */
        (0, globals_1.test)('Should be NOT able to sign transactions without a wallet/provider', async () => {
            // Provider without a wallet
            const providerWithoutWallet = new src_1.VeChainProvider(thorClient);
            // Sign without a wallet
            await (0, globals_1.expect)(providerWithoutWallet.request({
                method: src_1.RPC_METHODS.eth_signTransaction,
                params: [
                    {
                        from: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .sender.address,
                        to: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .receiver.address,
                        value: '0x111'
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign transactions without the 'from' field
         */
        (0, globals_1.test)('Should be NOT able to sign transactions without the "from" field', async () => {
            // Sign without the 'from' field
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTransaction,
                params: [
                    {
                        to: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .receiver.address,
                        value: '0x111'
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign transactions with an invalid 'from' field
         */
        (0, globals_1.test)('Should be NOT able to sign transactions with an invalid "from" field', async () => {
            // Sign with an invalid 'from' field
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTransaction,
                params: [
                    {
                        from: 'INVALID_ADDRESS',
                        to: fixture_2.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE
                            .receiver.address,
                        value: '0x111'
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Should be NOT able to sign transactions with invalid input params
         */
        (0, globals_1.test)('Should be NOT able to sign transactions with invalid input params', async () => {
            // Sign with invalid input params
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTransaction,
                params: ['INVALID_PARAMS']
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
