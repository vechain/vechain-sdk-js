"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("../../../fixture");
const fixture_2 = require("../fixture");
const src_1 = require("../../../../src");
/**
 *VeChain provider tests - Mainnet
 *
 * @group integration/providers/vechain-provider-mainnet
 */
(0, globals_1.describe)('VeChain provider tests - mainnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = new src_1.ThorClient(fixture_1.mainNetwork);
        provider = new src_1.VeChainProvider(thorClient);
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
    fixture_2.providerMethodsTestCasesMainnet.forEach(({ description, method, params, expected }) => {
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
    (0, globals_1.describe)('resolveName(vnsName)', () => {
        (0, globals_1.test)('Should be able to resolve an address by name', async () => {
            const name = 'clayton.vet';
            const address = await provider.resolveName(name);
            (0, globals_1.expect)(address).toBe('0xC12B77B4467e3eDD6b16C978B8387a6A3Af8E8d7');
        });
        (0, globals_1.test)('Should resolve to null for unknown names', async () => {
            const name = 'unknown.test-sdk.vet';
            const address = await provider.resolveName(name);
            (0, globals_1.expect)(address).toBe(null);
        });
    });
    (0, globals_1.describe)('lookupAddress(address)', () => {
        (0, globals_1.test)('Should be able to lookup a name for an address', async () => {
            const address = '0xC12B77B4467e3eDD6b16C978B8387a6A3Af8E8d7';
            const name = await provider.lookupAddress(address);
            (0, globals_1.expect)(name).toBe('clayton.vet');
        });
        (0, globals_1.test)('Should resolve to null for unknown names', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            const name = await provider.resolveName(address);
            (0, globals_1.expect)(name).toBe(null);
        });
    });
});
