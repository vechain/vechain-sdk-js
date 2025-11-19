"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/net_version
 */
(0, globals_1.describe)('RPC Mapper - net_version method tests', () => {
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
     * net_version RPC call tests - Positive cases
     */
    (0, globals_1.describe)('net_version - Positive cases', () => {
        /**
         * Test case regarding obtaining the net_version
         */
        (0, globals_1.test)('Should return the net_version (the chain id in our case)', async () => {
            // net_version and eth_chainId should return the same value
            const rpcCallNetVersion = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.net_version]([]));
            const rpcCallChainId = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_chainId]([]));
            (0, globals_1.expect)(rpcCallNetVersion).toBe(rpcCallChainId);
        });
    });
});
