"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("../fixture");
const src_1 = require("../../../../src");
/**
 * Hardhat provider tests - Mainnet
 *
 * @group integration/providers/hardhat-provider-mainnet
 */
(0, globals_1.describe)('Hardhat provider tests', () => {
    /**
     * Hardhat provider instances
     */
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        provider = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([]), src_1.MAINNET_URL, (message, parent) => new Error(message, parent));
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    /**
     * Provider methods tests
     */
    fixture_1.providerMethodsTestCasesMainnet.forEach(({ description, method, params, expected }) => {
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
     * eth_getBalance RPC call test
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
     * The methods request, send, sendAsync must give the same result
     */
    (0, globals_1.test)('Should be able to get chain id using request, send and sendAsync methods', async () => {
        // Call RPC function
        const rpcCall = await provider.send('eth_chainId', []);
        // Call RPC function using send method (same result as above)
        const rpcCallSend = await provider.send('eth_chainId', []);
        // Call RPC function using send-async method (same result as above)
        await provider.sendAsync({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_chainId',
            params: []
        }, (error, response) => {
            // Response should be defined
            (0, globals_1.expect)(response).toBeDefined();
            // An error should not be thrown
            (0, globals_1.expect)(error).toBeNull();
            // Expected result
            (0, globals_1.expect)(response.result).toBe(rpcCall);
            (0, globals_1.expect)(response.result).toBe(rpcCallSend);
        });
        // Compare the result with the expected value
        (0, globals_1.expect)(rpcCall).toBe(rpcCallSend);
    });
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
        // Call RPC function and throw error using send method (same result as above)
        await (0, globals_1.expect)(async () => await provider.send('INVALID_METHOD', [-1])).rejects.toThrowError();
        // Call RPC function and throw error using send-async method (same result as above)
        await provider.sendAsync({
            jsonrpc: '2.0',
            id: 1,
            method: 'INVALID_METHOD',
            params: [-1]
        }, (error, response) => {
            // Response should be undefined
            (0, globals_1.expect)(response).toBeDefined();
            // An error should be thrown
            (0, globals_1.expect)(error).toBeDefined();
        });
    });
});
