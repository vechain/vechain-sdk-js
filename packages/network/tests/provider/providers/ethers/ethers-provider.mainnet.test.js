"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const fixture_1 = require("../fixture");
/**
 *VeChain provider tests - Main Network
 *
 * @group integration/providers/vechain-provider-mainnet
 */
(0, globals_1.describe)('VeChain provider tests - solo', () => {
    let hardhatVeChainProvider;
    let jsonRPCEthersProvider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        hardhatVeChainProvider = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([]), src_1.MAINNET_URL, (message, parent) => new Error(message, parent), false);
        jsonRPCEthersProvider = new src_1.JSONRPCEthersProvider(sdk_core_1.MAINNET_NETWORK.chainTag, src_1.MAINNET_URL, hardhatVeChainProvider);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        hardhatVeChainProvider.destroy();
        jsonRPCEthersProvider.destroy();
    });
    /**
     * eth_getBalance RPC call test
     */
    (0, globals_1.test)('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await jsonRPCEthersProvider.send('eth_blockNumber', []);
        // Compare the result with the expected value
        (0, globals_1.expect)(rpcCall).not.toBe('0x0');
    });
    /**
     * Provider methods tests
     */
    fixture_1.providerMethodsTestCasesMainnet.forEach(({ description, method, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            // Call RPC function
            const rpcCall = await jsonRPCEthersProvider.send(method, params);
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
        });
    });
    /**
     * eth_subscribe latest blocks RPC call test
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest blocks', async () => {
        const messageReceived = new Promise((resolve) => {
            void jsonRPCEthersProvider.on('block', (message) => {
                resolve(message);
                jsonRPCEthersProvider.destroy();
            });
        });
        const message = (await messageReceived);
        // Optionally, you can do assertions or other operations with the message
        (0, globals_1.expect)(message).toBeDefined();
    }, 30000);
    /**
     * Invalid RPC method tests
     */
    (0, globals_1.test)('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        (0, globals_1.expect)(jsonRPCEthersProvider).toBeDefined();
        // Call RPC function
        await (0, globals_1.expect)(async () => await jsonRPCEthersProvider.send('INVALID_METHOD', [-1])).rejects.toThrowError();
    });
});
