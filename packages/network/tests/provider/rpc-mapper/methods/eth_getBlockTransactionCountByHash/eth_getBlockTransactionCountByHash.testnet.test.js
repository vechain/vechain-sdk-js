"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("../eth_getBlockByHash/fixture");
/**
 * RPC Mapper integration tests for 'eth_getBlockTransactionCountByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockTransactionCountByHash
 */
(0, globals_1.describe)('RPC Mapper - eth_getBlockTransactionCountByHash method tests', () => {
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
     * eth_getBlockTransactionCountByHash RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getBlockTransactionCountByHash - Positive cases', () => {
        /**
         * eth_getBlockTransactionCountByHash RPC method positive test cases
         */
        fixture_1.ethGetBlockByHashTestCases.forEach(({ description, params, expectedTransactionsLength }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC function
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockTransactionCountByHash]([params[0]]);
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toStrictEqual(expectedTransactionsLength);
            });
        });
    });
    /**
     * eth_getBlockTransactionCountByHash RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getBlockTransactionCountByHash - Negative cases', () => {
        /**
         * Invalid eth_getBlockByHash RPC method test cases
         */
        fixture_1.invalidEthGetBlockByHashTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC function
                await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockTransactionCountByHash]([params[0]])).rejects.toThrowError(expectedError);
            });
        });
    });
});
