"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_sendRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendRawTransaction
 */
(0, globals_1.describe)('RPC Mapper - eth_sendRawTransaction method tests', () => {
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
     * eth_sendRawTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_sendRawTransaction - Negative cases', () => {
        /**
         *  Test case where request fails
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` when request fails', async () => {
            // Mock the getBlock method to throw error
            globals_1.jest.spyOn(thorClient.transactions, 'sendRawTransaction').mockRejectedValue(new Error());
            await (0, globals_1.expect)(async () => {
                (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_sendRawTransaction](['0x123456789']));
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
