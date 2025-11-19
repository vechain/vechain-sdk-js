"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_getUncleCountByBlockNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleCountByBlockNumber
 */
(0, globals_1.describe)('RPC Mapper - eth_getUncleCountByBlockNumber method tests', () => {
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
     * eth_getUncleCountByBlockNumber RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getUncleCountByBlockNumber - Positive cases', () => {
        /**
         * Should return uncle block count at the given block number
         */
        (0, globals_1.test)('Should return uncle block count at the given block number', async () => {
            const uncleBlock = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleCountByBlockNumber](['latest']);
            (0, globals_1.expect)(uncleBlock).toStrictEqual(0);
        });
    });
    /**
     * eth_getUncleCountByBlockNumber RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getUncleCountByBlockNumber - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block count at the given block number
         */
        (0, globals_1.test)('Should NOT be able to return uncle block count at the given block number', async () => {
            // No params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleCountByBlockNumber]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Invalid params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleCountByBlockNumber](['latest', 1])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
