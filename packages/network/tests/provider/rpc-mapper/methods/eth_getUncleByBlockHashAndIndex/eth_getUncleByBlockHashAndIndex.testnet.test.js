"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_getUncleByBlockHashAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleByBlockHashAndIndex
 */
(0, globals_1.describe)('RPC Mapper - eth_getUncleByBlockHashAndIndex method tests', () => {
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
     * eth_getUncleByBlockHashAndIndex RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getUncleByBlockHashAndIndex - Positive cases', () => {
        /**
         * Should return uncle block at the given block hash and index
         */
        (0, globals_1.test)('Should return uncle block at the given block hash and index', async () => {
            const uncleBlock = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockHashAndIndex]([
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
                '0x0'
            ]);
            (0, globals_1.expect)(uncleBlock).toStrictEqual(null);
        });
    });
    /**
     * eth_getUncleByBlockHashAndIndex RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getUncleByBlockHashAndIndex - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block at the given block hash and index with invalid params
         */
        (0, globals_1.test)('Should NOT be able to return uncle block at the given block hash and index with invalid params', async () => {
            // No params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockHashAndIndex]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Only 1 param
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockHashAndIndex](['latest'])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Invalid params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getUncleByBlockHashAndIndex](['latest', 1])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
