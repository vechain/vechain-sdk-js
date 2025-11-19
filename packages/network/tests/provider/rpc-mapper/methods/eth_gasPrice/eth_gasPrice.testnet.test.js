"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'eth_gasPrice' method
 *
 * @group integration/rpc-mapper/methods/eth_gasPrice
 */
(0, globals_1.describe)('RPC Mapper - eth_gasPrice method tests', () => {
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
     * eth_gasPrice RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_gasPrice - Positive cases', () => {
        /**
         * Positive case 1 - Get a dummy gas price value.
         */
        (0, globals_1.test)('eth_gasPrice - Dummy gas price value', async () => {
            const gasPrice = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_gasPrice]([]);
            (0, globals_1.expect)(gasPrice).toBe('0x98cb8c52800');
        });
    });
});
