"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'engine_getPayloadV2' method
 *
 * @group integration/rpc-mapper/methods/engine_getPayloadV2
 */
(0, globals_1.describe)('RPC Mapper - engine_getPayloadV2 method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
    });
    /**
     * engine_getPayloadV2 RPC call tests - Not Implemented
     */
    (0, globals_1.describe)('engine_getPayloadV2 - Not Implemented', () => {
        /**
         * Test that the method throws JSONRPCMethodNotImplemented when called via provider
         */
        (0, globals_1.test)('Should throw JSONRPCMethodNotImplemented error', async () => {
            await (0, globals_1.expect)(provider.request({
                method: src_1.RPC_METHODS.engine_getPayloadV2,
                params: []
            })).rejects.toThrowError(sdk_errors_1.JSONRPCMethodNotImplemented);
        });
    });
});
