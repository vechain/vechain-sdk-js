"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId-testnet
 */
(0, globals_1.describe)('RPC Mapper - eth_chainId method tests testnet', () => {
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
     * eth_chainId RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_chainId - Positive cases', () => {
        /**
         * Test case regarding obtaining the chain id
         */
        (0, globals_1.test)('Should return the chain id', async () => {
            const rpcCallChainId = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_chainId]([]));
            (0, globals_1.expect)(rpcCallChainId).toBe(src_1.CHAIN_ID.TESTNET);
        });
    });
});
