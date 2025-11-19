"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'txpool_contentFrom' method
 *
 * @group integration/rpc-mapper/methods/txpool_contentFrom
 */
(0, globals_1.describe)('RPC Mapper - txpool_contentFrom method tests', () => {
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
     * txpool_contentFrom RPC call tests - Positive cases
     */
    (0, globals_1.describe)('txpool_contentFrom - Positive cases', () => {
        /**
         * Should return the transaction pool content from address
         */
        (0, globals_1.test)('Should return the transaction pool content from address', async () => {
            const txPoolInspect = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.txpool_contentFrom](['0x9e7911de289c3c856ce7f421034f66b6cde49c39']);
            (0, globals_1.expect)(txPoolInspect).toStrictEqual({});
        });
    });
    /**
     * txpool_contentFrom RPC call tests - Negative cases
     */
    (0, globals_1.describe)('txpool_contentFrom - Negative cases', () => {
        /**
         * Should not be able to return the transaction pool content from address
         */
        (0, globals_1.test)('Should not be able to return the transaction pool content from address', async () => {
            // No params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.txpool_contentFrom]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Extra params
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.txpool_contentFrom](['0x9e7911de289c3c856ce7f421034f66b6cde49c39', 'extra'])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Invalid address
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.txpool_contentFrom](['INVALID_ADDRESS'])).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
