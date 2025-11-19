"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getTransactionByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByHash
 */
(0, globals_1.describe)('RPC Mapper - eth_getTransactionByHash method tests', () => {
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
     * eth_getTransactionByHash RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getTransactionByHash - Positive cases', () => {
        /**
         * Test cases where the rpc method call does not throw an error
         */
        fixture_1.ethGetTransactionByHashTestCases.forEach(({ description, params, expected }) => {
            (0, globals_1.test)(description, async () => {
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionByHash](params);
                (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
            });
        });
    });
    /**
     * eth_getTransactionByHash RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getTransactionByHash - Negative cases', () => {
        /**
         * Test cases where the rpc method call throws an error
         */
        fixture_1.invalidEthGetTransactionByHashTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionByHash](params)).rejects.toThrowError(expectedError);
            });
        });
    });
});
