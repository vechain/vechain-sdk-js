"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("../../../../fixture");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_unit_1 = require("../../../../signer/signers/vechain-private-key-signer/fixture-unit");
/**
 * RPC Mapper integration tests for 'eth_signTypedData_v4' method
 *
 * @group integration/rpc-mapper/methods/eth_signTypedData_v4
 */
(0, globals_1.describe)('RPC Mapper - eth_signTypedData_v4 method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Provider instance
     */
    let provider;
    /**
     * The account to use for testing
     */
    let testAccount;
    /**
     * Wallet address to use for testing
     */
    let walletAddress;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(async () => {
        // Get a test account
        testAccount = (0, fixture_1.getUnusedAccount)();
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        // Init provider
        // @NOTE: Since we are testing the signature, we can use SOLO accounts with testnet!
        provider = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(testAccount.privateKey).bytes,
                publicKey: sdk_core_1.Secp256k1.derivePublicKey(sdk_core_1.HexUInt.of(testAccount.privateKey).bytes),
                address: testAccount.address
            }
        ]));
        // Verify wallet exists
        (0, globals_1.expect)(provider.wallet).toBeDefined();
        // Get addresses from wallet
        const addresses = await provider.wallet?.getAddresses();
        (0, globals_1.expect)(addresses).toBeDefined();
        (0, globals_1.expect)(addresses?.length).toBeGreaterThan(0);
        // Store the first address for tests
        walletAddress = addresses?.[0];
    });
    /**
     * eth_signTypedData_v4 RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_signTypedData_v4 - Positive cases', () => {
        /**
         * Should be able to sign a typed message
         */
        (0, globals_1.test)('Should be able to sign a typed message', async () => {
            const signedTransaction = (await provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [
                    walletAddress,
                    {
                        domain: fixture_unit_1.eip712TestCases.valid.domain,
                        types: fixture_unit_1.eip712TestCases.valid.types,
                        message: fixture_unit_1.eip712TestCases.valid.data,
                        primaryType: fixture_unit_1.eip712TestCases.valid.primaryType
                    }
                ]
            }));
            // Signed transaction should be a hex string
            (0, globals_1.expect)(sdk_core_1.Hex.isValid0x(signedTransaction)).toBe(true);
        });
        /**
         * Should be able to sign a typed message with a JSON string as input
         */
        (0, globals_1.test)('Should be able to sign a typed message with a JSON string as input', async () => {
            const typedDataString = JSON.stringify({
                domain: fixture_unit_1.eip712TestCases.valid.domain,
                types: fixture_unit_1.eip712TestCases.valid.types,
                message: fixture_unit_1.eip712TestCases.valid.data,
                primaryType: fixture_unit_1.eip712TestCases.valid.primaryType
            });
            const signedTransaction = (await provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [testAccount.address, typedDataString]
            }));
            // Signed transaction should be a hex string
            (0, globals_1.expect)(sdk_core_1.Hex.isValid0x(signedTransaction)).toBe(true);
        });
    });
    /**
     * eth_signTypedData_v4 RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_signTypedData_v4 - Negative cases', () => {
        /**
         * Should be NOT able to sign an invalid typed message
         */
        (0, globals_1.test)('Should be NOT able to sign an invalid typed message', async () => {
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [
                    walletAddress,
                    {
                        domain: 'INVALID',
                        types: fixture_unit_1.eip712TestCases.valid.types,
                        message: fixture_unit_1.eip712TestCases.valid.data,
                        primaryType: fixture_unit_1.eip712TestCases.valid.primaryType
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign with an invalid JSON string
         */
        (0, globals_1.test)('Should be NOT able to sign with an invalid JSON string', async () => {
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [testAccount.address, '{invalid json string']
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign a valid message without a wallet/provider
         */
        (0, globals_1.test)('Should be NOT able to sign a valid message without a wallet/provider', async () => {
            // Provider without a wallet
            const providerWithoutWallet = new src_1.VeChainProvider(thorClient);
            // Sign without a wallet
            await (0, globals_1.expect)(providerWithoutWallet.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [
                    testAccount.address,
                    {
                        domain: fixture_unit_1.eip712TestCases.valid.domain,
                        types: fixture_unit_1.eip712TestCases.valid.types,
                        message: fixture_unit_1.eip712TestCases.valid.data,
                        primaryType: fixture_unit_1.eip712TestCases.valid.primaryType
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign an invalid structured message
         */
        (0, globals_1.test)('Should be NOT able to sign an invalid structured message', async () => {
            // Sign without the 'from' field
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [walletAddress]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign the message without the address
         */
        (0, globals_1.test)('Should be NOT able to sign the message without the address', async () => {
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: [
                    {
                        domain: fixture_unit_1.eip712TestCases.valid.domain,
                        types: fixture_unit_1.eip712TestCases.valid.types,
                        message: fixture_unit_1.eip712TestCases.valid.data,
                        primaryType: fixture_unit_1.eip712TestCases.valid.primaryType
                    }
                ]
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
        /**
         * Should be NOT able to sign the message with invalid input params
         */
        (0, globals_1.test)('Should be NOT able to sign the message with invalid input params', async () => {
            // Sign with invalid input params
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_signTypedData_v4,
                params: ['INVALID_PARAMS']
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
