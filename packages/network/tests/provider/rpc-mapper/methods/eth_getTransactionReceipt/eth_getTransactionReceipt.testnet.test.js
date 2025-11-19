"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getTransactionReceipt' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionReceipt
 */
(0, globals_1.describe)('RPC Mapper - eth_getTransactionReceipt method tests', () => {
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
     * eth_getTransactionReceipt RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getTransactionReceipt - Positive cases', () => {
        /**
         * Positive cases - Test network
         */
        fixture_1.getReceiptCorrectCasesTestNetwork.forEach((testCase) => {
            (0, globals_1.test)(testCase.testCase, async () => {
                const receipt = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionReceipt]([testCase.hash]);
                (0, globals_1.expect)(receipt).toEqual(testCase.expected);
            }, 7000);
        });
    });
    /**
     * eth_getTransactionReceipt RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getTransactionReceipt - Negative cases', () => {
        /**
         * Negative cases - Test network
         */
        fixture_1.getReceiptIncorrectCasesTestNetwork.forEach((fixture) => {
            (0, globals_1.test)(fixture.testCase, async () => {
                await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionReceipt](fixture.params)).rejects.toThrowError(fixture.expectedError);
            }, 7000);
        });
    });
});
