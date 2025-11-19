"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'txpool_status' method
 *
 * @group integration/rpc-mapper/methods/txpool_status
 */
(0, globals_1.describe)('RPC Mapper - txpool_status method tests', () => {
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
     * txpool_status RPC call tests - Positive cases
     */
    (0, globals_1.describe)('txpool_status - Positive cases', () => {
        /**
         * Should return the transaction pool status
         */
        (0, globals_1.test)('Should return the transaction pool status', async () => {
            const txPoolInspect = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.txpool_status]([]);
            (0, globals_1.expect)(txPoolInspect).toStrictEqual({});
        });
    });
});
