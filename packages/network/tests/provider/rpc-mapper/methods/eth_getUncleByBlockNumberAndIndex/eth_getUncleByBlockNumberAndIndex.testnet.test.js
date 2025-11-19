"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_getUncleByBlockNumberAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleByBlockNumberAndIndex
 */
(0, globals_1.describe)('RPC Mapper - eth_getUncleByBlockNumberAndIndex method tests', () => {
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
     * eth_getUncleByBlockNumberAndIndex RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getUncleByBlockNumberAndIndex - Positive cases', () => {
        /**
         * Should return uncle block at the given block number and index
         */
        (0, globals_1.test)('Should return uncle block at the given block number and index', async () => {
            const uncleBlock = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockNumberAndIndex](['latest', '0x0']);
            (0, globals_1.expect)(uncleBlock).toStrictEqual(null);
        });
    });
    /**
     * eth_getUncleByBlockNumberAndIndex RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getUncleByBlockNumberAndIndex - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block at the given block number and index with invalid params
         */
        (0, globals_1.test)('Should NOT be able to return uncle block at the given block number and index with invalid params', async () => {
            // No params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockNumberAndIndex]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Only 1 param
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockNumberAndIndex](['latest'])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Invalid params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockNumberAndIndex](['latest', 1])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
