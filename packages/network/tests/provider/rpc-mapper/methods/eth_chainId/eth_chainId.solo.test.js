"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId-solo
 */
(0, globals_1.describe)('RPC Mapper - eth_chainId method tests solo', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * eth_chainId RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_chainId - Positive cases', () => {
        /**
         * Test case regarding obtaining the chain id
         */
        (0, globals_1.test)('Should return the chain id', async () => {
            const ethGetBlockByNumber = (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getBlockByNumber];
            const genesisBlock = await ethGetBlockByNumber(['0x0', true]);
            const blockHash = genesisBlock.hash.slice(2);
            const chainTagByte = blockHash.slice(-2);
            const chaintagId = `0x${chainTagByte}`;
            const rpcCallChainId = (await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_chainId]([])));
            (0, globals_1.expect)(rpcCallChainId).toBe(chaintagId);
        });
    });
});
