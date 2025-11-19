"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'net_listening' method
 *
 * @group integration/rpc-mapper/methods/net_listening
 */
(0, globals_1.describe)('RPC Mapper - net_listening method tests', () => {
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
     * net_listening RPC call tests - Positive cases
     */
    (0, globals_1.describe)('net_listening - Positive cases', () => {
        /**
         * Should be able to gety if the node is listening
         */
        (0, globals_1.test)('Should be able to get if the node is listening', async () => {
            const peers = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.net_listening]([]);
            (0, globals_1.expect)(peers).toBeDefined();
        });
    });
});
