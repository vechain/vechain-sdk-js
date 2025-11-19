"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'evm_mine' method
 *
 * @group integration/rpc-mapper/methods/evm_mine
 */
(0, globals_1.describe)('RPC Mapper - evm_mine method tests', () => {
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
     * evm_mine RPC call tests - Positive cases
     */
    (0, globals_1.describe)('evm_mine - Positive cases', () => {
        /**
         * Positive case 1 - get new block
         */
        (0, globals_1.test)('evm_mine - positive case 1', async () => {
            const bestBlock = await thorClient.blocks.getBestBlockCompressed();
            const rpcCallEvmMine = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.evm_mine]([]));
            if (bestBlock != null && rpcCallEvmMine != null) {
                (0, globals_1.expect)(Number(rpcCallEvmMine.number)).toBeGreaterThanOrEqual(bestBlock.number + 1);
            }
        }, 18000);
    });
});
