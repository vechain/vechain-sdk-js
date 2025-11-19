"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getTransactionCount' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionCount
 */
(0, globals_1.describe)('RPC Mapper - eth_getTransactionCount method tests', () => {
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
     * eth_getTransactionCount RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getTransactionCount - Positive cases', () => {
        /**
         * Positive case 1 - Get a random nonce (@note different from Ethereum)
         */
        (0, globals_1.test)('eth_getTransactionCount - get a random nonce', async () => {
            // Random nonce
            const transactionCount = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionCount](['0x0b41c56e19c5151122568873a039fEa090937Fe2', 'latest']);
            (0, globals_1.expect)(transactionCount).toBeDefined();
        });
    });
    /**
     * eth_getTransactionCount RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getTransactionCount - Negative cases', () => {
        /**
         * Invalid params case 1 - Missing params
         */
        fixture_1.invalidEthGetTransactionCountTestCases.forEach(({ description, params, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionCount](params)).rejects.toThrowError(expectedError);
            });
        });
    });
});
