"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
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
     * eth_getTransactionReceipt RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getTransactionReceipt - Negative cases', () => {
        /**
         * Negative case 1 - An error occurs while retrieving the transaction receipt
         */
        (0, globals_1.test)('eth_getTransactionReceipt - negative case 1', async () => {
            // Mock the getTransactionReceipt method to throw an error
            globals_1.jest.spyOn(thorClient.transactions, 'getTransactionReceipt').mockRejectedValue(new Error());
            // Call eth_getTransactionReceipt with a valid transaction hash BUT an error occurs while retrieving the transaction receipt
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionReceipt]([fixture_1.getReceiptCorrectCasesTestNetwork[0].hash])).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Negative case 2 - Transaction details of existing transaction are not found (returns null)
         */
        (0, globals_1.test)('eth_getTransactionReceipt - negative case 2', async () => {
            // Mock the getTransactionReceipt method to throw an error
            globals_1.jest.spyOn(thorClient.transactions, 'getTransaction').mockResolvedValue(null);
            // Call eth_getTransactionReceipt with a valid transaction hash BUT an error occurs while retrieving the transaction receipt
            const receipt = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getTransactionReceipt]([fixture_1.getReceiptCorrectCasesTestNetwork[0].hash]);
            (0, globals_1.expect)(receipt).toBe(null);
        });
    });
});
