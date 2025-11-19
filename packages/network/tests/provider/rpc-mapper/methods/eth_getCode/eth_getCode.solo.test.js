"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_getCode' method - Solo Network
 *
 * @group integration/rpc-mapper/methods/eth_getCode
 */
(0, globals_1.describe)('RPC Mapper - eth_getCode method tests', () => {
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
     * eth_getCode RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getCode - Positive cases', () => {
        /**
         * Test cases for eth_getCode RPC method that do not throw an error
         */
        fixture_1.ethGetCodeTestCases.forEach(({ description, params, expected }) => {
            (0, globals_1.test)(`${description}`, async () => {
                const rpcCall = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getCode](params));
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toBe(expected);
            });
        });
    });
    /**
     * eth_getCode RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getCode - Negative cases', () => {
        /**
         * Test cases for eth_getCode RPC method that throw an error
         */
        fixture_1.invalidEthGetCodeTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(`${description}`, async () => {
                await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getCode](params))).rejects.toThrowError(expectedError);
            });
        });
    });
});
