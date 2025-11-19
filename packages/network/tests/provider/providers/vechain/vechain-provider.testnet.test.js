"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../src");
const fixture_1 = require("../fixture");
const helpers_1 = require("../helpers");
/**
 *VeChain provider tests
 *
 * @group integration/providers/vechain-provider
 */
(0, globals_1.describe)('VeChain provider tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
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
        })).rejects.toThrowError(sdk_errors_1.JSONRPCMethodNotFound);
    });
    /**
     * Return null signer if wallet is not defined
     */
    (0, globals_1.test)('Should throw an error if delegation is enabled and gasPayer is not defined', async () => {
        const nullSigner = await provider.getSigner('0x0000000000000000000000000000456e65726779');
        (0, globals_1.expect)(nullSigner).toBeNull();
    });
    /**
     * Method not implemented and method not found tests
     */
    (0, globals_1.describe)('Method not implemented and method not found', () => {
        /**
         * Test for method in RPC_METHODS enum but not in RPCMethodsMap
         */
        (0, globals_1.test)('Should throw JSONRPCMethodNotImplemented for method in enum but not in map', async () => {
            // Assuming eth_getProof is in the enum but commented out in the map
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.eth_getProof,
                params: []
            })).rejects.toThrowError(sdk_errors_1.JSONRPCMethodNotImplemented);
        });
        /**
         * Test for method not in RPC_METHODS enum
         */
        (0, globals_1.test)('Should throw JSONRPCMethodNotFound for method not in enum', async () => {
            await (0, globals_1.expect)(provider.request({
                method: 'non_existent_method',
                params: []
            })).rejects.toThrowError(sdk_errors_1.JSONRPCMethodNotFound);
        });
    });
});
