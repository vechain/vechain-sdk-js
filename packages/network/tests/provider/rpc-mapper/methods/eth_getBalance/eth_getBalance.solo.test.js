"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_getBalance' method
 *
 * @group integration/rpc-mapper/methods/eth_getBalance
 */
(0, globals_1.describe)('RPC Mapper - eth_getBalance method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * eth_getBalance RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getBalance - Positive cases', () => {
        /**
         * Test cases for eth_getBalance RPC method that do not throw an error
         */
        fixture_1.ethGetBalanceTestCases.forEach(({ description, params, expected }) => {
            (0, globals_1.test)(description, async () => {
                const rpcCall = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBalance](params));
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
            });
        });
        /**
         * Test cases for eth_getBalance RPC method that throw an error
         */
        fixture_1.invalidEthGetBalanceTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC method
                await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBalance](params))).rejects.toThrowError(expectedError);
            });
        });
    });
    /**
     * eth_getBalance RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getBalance - Negative cases', () => { });
});
