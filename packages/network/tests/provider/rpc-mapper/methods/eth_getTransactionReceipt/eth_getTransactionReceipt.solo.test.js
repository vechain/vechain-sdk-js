"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const test_utils_1 = require("../../../../test-utils");
// Remove blockHash and blockNumber fields from the object for comparison
function removeBlockNumAndHashFields(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeBlockNumAndHashFields);
    }
    else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        const objRecord = obj;
        for (const key in objRecord) {
            if (key !== 'blockHash' && key !== 'blockNumber') {
                newObj[key] = removeBlockNumAndHashFields(objRecord[key]);
            }
        }
        return newObj;
    }
    return obj;
}
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
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * eth_getTransactionReceipt RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getTransactionReceipt - Positive cases', () => {
        /**
         * Positive cases - Solo network
         */
        fixture_1.getReceiptCorrectCasesSoloNetwork.forEach((testCase) => {
            (0, globals_1.test)(testCase.testCase, async () => {
                const receipt = await (0, test_utils_1.retryOperation)(async () => {
                    return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionReceipt]([testCase.hash]);
                });
                const receiptWithoutBlockHash = removeBlockNumAndHashFields(receipt);
                const expectedWithoutBlockHash = removeBlockNumAndHashFields(testCase.expected);
                (0, globals_1.expect)(receiptWithoutBlockHash).toEqual(expectedWithoutBlockHash);
            }, 15000);
        });
    });
});
