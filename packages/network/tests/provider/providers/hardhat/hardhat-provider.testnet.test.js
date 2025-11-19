"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("../fixture");
const helpers_1 = require("../helpers");
const src_1 = require("../../../../src");
/**
 *VeChain provider tests
 *
 * @group integration/providers/vechain-provider-testnet
 */
(0, globals_1.describe)('Hardhat provider tests - testnet', () => {
    /**
     * Hardhat provider instances
     */
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        provider = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([]), src_1.TESTNET_URL, (message, parent) => new Error(message, parent));
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        // Remove all event listeners
        provider.removeAllListeners();
        provider.destroy();
    });
    /**
     * Global cleanup to ensure all resources are released
     */
    (0, globals_1.afterAll)(() => {
        // Force cleanup of any remaining timers/intervals
        jest.clearAllTimers();
    });
    /**
     * Provider methods tests
     */
    fixture_1.providerMethodsTestCasesTestnet.forEach(({ description, method, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            // Call RPC function
            const rpcCall = await provider.request({
                method,
                params
            });
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
        });
    });
    /**
     * eth_blockNumber RPC call test
     */
    (0, globals_1.test)('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_blockNumber',
            params: []
        });
        // Compare the result with the expected value
        (0, globals_1.expect)(rpcCall).not.toBe('0x0');
    });
    /**
     * eth_subscribe latest blocks RPC call test
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest blocks', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });
        const messageReceived = (0, helpers_1.waitForMessage)(provider);
        const message = await messageReceived;
        // Optionally, you can do assertions or other operations with the message
        (0, globals_1.expect)(message).toBeDefined();
        (0, globals_1.expect)(message.method).toBe('eth_subscription');
        (0, globals_1.expect)(message.params.subscription).toBeDefined();
        // Compare the result with the expected value
        (0, globals_1.expect)(rpcCall).not.toBe('0x0');
    }, 12000);
    /**
     * eth_getBalance RPC call test
     */
    /**
     * Invalid RPC method tests
     */
    (0, globals_1.test)('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        (0, globals_1.expect)(provider).toBeDefined();
        // Call RPC function
        await (0, globals_1.expect)(async () => await provider.request({
            method: 'INVALID_METHOD',
            params: [-1]
        })).rejects.toThrowError();
    });
    /**
     * Custom RPC configuration tests
     */
    (0, globals_1.describe)('Custom RPC configuration tests', () => {
        /**
         * Should return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountDefaultValue set to true
         */
        (0, globals_1.test)('Should return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountMustReturn0 set to true', async () => {
            // Set the custom RPC configuration
            const providerWithCustomRPCConfiguration = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([]), src_1.TESTNET_URL, (message, parent) => new Error(message, parent), false, false, { ethGetTransactionCountMustReturn0: true });
            // Call RPC function
            const rpcCall = await providerWithCustomRPCConfiguration.request({
                method: 'eth_getTransactionCount',
                params: ['0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', 'latest']
            });
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toBe('0x0');
        });
        /**
         * Should NOT return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountDefaultValue set to false
         */
        (0, globals_1.test)('Should NOT return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountMustReturn0 set to false', async () => {
            // Set the custom RPC configuration
            const providerWithCustomRPCConfiguration = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([]), src_1.TESTNET_URL, (message, parent) => new Error(message, parent), false, false, { ethGetTransactionCountMustReturn0: false });
            // Call RPC function
            const rpcCall = await providerWithCustomRPCConfiguration.request({
                method: 'eth_getTransactionCount',
                params: ['0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', 'latest']
            });
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).not.toBe('0x0');
        });
    });
});
