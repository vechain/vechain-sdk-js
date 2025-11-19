"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'eth_getBlockByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByHash
 */
(0, globals_1.describe)('RPC Mapper - eth_getBlockByHash method tests', () => {
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
     * eth_getBlockByHash RPC call tests - Negative cases
     */
    (0, globals_1.describe)('Negative cases', () => {
        /**
         * Test case where request fails
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` when request fails', async () => {
            // Mock the getBlock method to throw error
            globals_1.jest.spyOn(thorClient.blocks, 'getBlockExpanded').mockRejectedValue(new Error());
            globals_1.jest.spyOn(thorClient.blocks, 'getBlockCompressed').mockRejectedValue(new Error());
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByHash](fixture_1.ethGetBlockByHashTestCases[0].params)).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
