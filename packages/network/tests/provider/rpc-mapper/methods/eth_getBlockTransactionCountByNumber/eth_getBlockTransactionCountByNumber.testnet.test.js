"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getBlockTransactionCountByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockTransactionCountByNumber
 */
(0, globals_1.describe)('RPC Mapper - eth_getBlockTransactionCountByNumber method tests', () => {
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
     * eth_getBlockTransactionCountByNumber RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getBlockTransactionCountByNumber - Positive cases', () => {
        /**
         * eth_getBlockTransactionCountByNumber RPC method positive test cases
         */
        fixture_1.validTestCases.forEach(({ description, blockNumberHex, expectedTxCount }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC function
                const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockTransactionCountByNumber]([blockNumberHex]);
                // Compare the result with the expected value
                (0, globals_1.expect)(rpcCall).toStrictEqual(expectedTxCount);
            });
        });
    });
    /**
     * eth_getBlockTransactionCountByNumber RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getBlockTransactionCountByNumber - Negative cases', () => {
        /**
         * Invalid eth_getBlockTransactionCountByNumber RPC method test cases
         */
        fixture_1.invalidTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                // Call RPC function
                await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockTransactionCountByNumber](params)).rejects.toThrowError(expectedError);
            });
        });
    });
});
