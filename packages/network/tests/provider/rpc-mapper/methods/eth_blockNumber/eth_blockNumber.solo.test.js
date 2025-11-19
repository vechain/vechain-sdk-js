"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_blockNumber' method on Solo Network
 *
 * @group integration/rpc-mapper/methods/eth_blockNumber
 */
(0, globals_1.describe)('RPC Mapper - eth_blockNumber method tests', () => {
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
     * eth_blockNumber RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_blockNumber - Positive cases', () => {
        /**
         * Test case where the latest block number is returned and updated when a new block is mined
         */
        (0, globals_1.test)('Should return the latest block number and the updated latest block number when updated', async () => {
            const rpcCallLatestBlockNumber = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_blockNumber]([]));
            (0, globals_1.expect)(rpcCallLatestBlockNumber).not.toBe('0x0');
            await thorClient.blocks.waitForBlockCompressed(Number(rpcCallLatestBlockNumber) + 1);
            const rpcCallUpdatedLatestBlockNumber = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_blockNumber]([]));
            (0, globals_1.expect)(rpcCallUpdatedLatestBlockNumber).not.toBe('0x0');
            (0, globals_1.expect)(Number(rpcCallUpdatedLatestBlockNumber)).toBeGreaterThanOrEqual(Number(rpcCallLatestBlockNumber) + 1);
        }, 30000);
    });
});
