"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * RPC Mapper integration tests for 'eth_estimateGas' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_estimateGas
 */
(0, globals_1.describe)('RPC Mapper - eth_estimateGas method tests', () => {
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
     * eth_call RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_call - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the estimateGas method
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` if an error occurs while estimating the gas', async () => {
            // Mock the estimateGas method to return null
            globals_1.jest.spyOn(thorClient.transactions, 'estimateGas').mockRejectedValue(new Error());
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_estimateGas]([
                sdk_core_1.Clause.transferVET(sdk_core_1.Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), sdk_core_1.VET.of(1000)),
                'latest'
            ])).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
