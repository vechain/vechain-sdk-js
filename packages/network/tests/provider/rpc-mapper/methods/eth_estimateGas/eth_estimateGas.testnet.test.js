"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'eth_estimateGas' method
 *
 * @group integration/rpc-mapper/methods/eth_estimateGas
 */
(0, globals_1.describe)('RPC Mapper - eth_estimateGas method tests', () => {
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
     * eth_estimateGas RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_estimateGas - Positive cases', () => {
        /**
         * Positive cases
         */
        fixture_1.positiveCasesFixtures.forEach((fixture) => {
            (0, globals_1.test)(fixture.description, async () => {
                const response = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_estimateGas](fixture.input);
                (0, globals_1.expect)(response).toBe(fixture.expected);
            });
        });
    });
    /**
     * eth_estimateGas RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_estimateGas - Negative cases', () => {
        /**
         * Negative cases
         */
        fixture_1.negativeCasesFixtures.forEach((fixture) => {
            (0, globals_1.test)(fixture.description, async () => {
                await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_estimateGas](fixture.input)).rejects.toThrowError(fixture.expected);
            });
        });
    });
});
