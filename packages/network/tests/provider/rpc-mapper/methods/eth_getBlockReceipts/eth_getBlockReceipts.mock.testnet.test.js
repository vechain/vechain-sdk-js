"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_getBlockReceipts' method
 *
 * @group integration/sdk-network/rpc-mapper/methods/eth_getBlockReceipts-mock
 */
(0, globals_1.describe)('RPC Mapper - eth_getBlockReceipts mock method tests', () => {
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
     * eth_getBlockReceipts RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getBlockReceipts - Positive cases', () => {
        /**
         * Positive case 1 - Simple block receipts retrieval
         */
        (0, globals_1.test)('Should return null if the fetched block is null', async () => {
            // Mock the estimateGas method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBlockExpanded').mockResolvedValue(null);
            // Call RPC function
            const rpcCall = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts](['latest']);
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toEqual(null);
        });
    });
    /**
     * eth_getBlockReceipts RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getBlockReceipts - Negative cases', () => {
        /**
         * Negative case 1 - Throws error if any error occurs while fetching block number
         */
        (0, globals_1.test)('Should throw error if errors while fetching block number', async () => {
            // Mock the estimateGas method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBlockExpanded').mockRejectedValue(new Error());
            // Call RPC function and expect an error
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockReceipts](['latest'])).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
