"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("../../../../fixture");
const fixture_2 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getStorageAt' method
 *
 * @group integration/rpc-mapper/methods/eth_getStorageAt
 */
(0, globals_1.describe)('RPC Mapper - eth_getStorageAt method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = new src_1.ThorClient(fixture_1.mainNetwork);
    });
    /**
     * eth_getStorageAt RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getStorageAt - Positive cases', () => {
        /**
         * Test cases for eth_getStorageAt RPC method that do not throw an error
         */
        fixture_2.ethGetStorageAtTestCases.forEach(({ description, params, expected }) => {
            (0, globals_1.test)(description, async () => {
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getStorageAt](params);
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toBe(expected);
            });
        });
    });
    /**
     * eth_getStorageAt RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getStorageAt - Negative cases', () => {
        /**
         * Test cases for eth_getStorageAt RPC method that throw an error
         */
        fixture_2.invalidEthGetStorageAtTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC method
                const rpcCall = (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getStorageAt](params);
                // Compare the result with the expected value
                await (0, globals_1.expect)(rpcCall).rejects.toThrowError(expectedError);
            });
        });
    });
});
