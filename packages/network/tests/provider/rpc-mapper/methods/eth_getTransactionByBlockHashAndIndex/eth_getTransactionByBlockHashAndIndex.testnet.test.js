"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getTransactionByBlockHashAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByBlockHashAndIndex
 */
(0, globals_1.describe)('RPC Mapper - eth_getTransactionByBlockHashAndIndex method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    /**
     * eth_getTransactionByBlockHashAndIndex RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getTransactionByBlockHashAndIndex - Positive cases', () => {
        /**
         * Test cases where the rpc method call does not throw an error
         */
        fixture_1.ethGetTransactionByBlockHashAndIndexTestCases.forEach(({ description, params, expected }) => {
            (0, globals_1.test)(description, async () => {
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionByBlockHashAndIndex](params);
                (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
            });
        });
    });
    /**
     * eth_getTransactionByBlockHashAndIndex RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getTransactionByBlockHashAndIndex - Negative cases', () => {
        /**
         * Test cases where the rpc method call throws an error
         */
        fixture_1.invalidEthGetTransactionByBlockHashAndIndexTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionByBlockHashAndIndex](params)).rejects.toThrowError(expectedError);
            });
        });
    });
});
