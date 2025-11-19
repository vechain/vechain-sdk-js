"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'debug_traceTransaction' method
 *
 * @group integration/rpc-mapper/methods/debug_traceTransaction-testnet
 */
(0, globals_1.describe)('RPC Mapper - debug_traceTransaction method tests testnet', () => {
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
     * debug_traceTransaction RPC call tests - Positive cases
     */
    (0, globals_1.describe)('debug_traceTransaction - Positive cases', () => {
        /**
         * Positive cases.
         */
        (0, globals_1.test)('debug_traceTransaction - positive cases', async () => {
            for (const fixture of fixture_1.debugTraceTransactionPositiveCasesFixtureTestnet) {
                const result = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceTransaction](fixture.input.params);
                (0, globals_1.expect)(result).toEqual(fixture.input.expected);
            }
        }, 30000);
    });
    /**
     * debug_traceTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('debug_traceTransaction - Negative cases', () => {
        /**
         * Negative cases.
         */
        (0, globals_1.test)('debug_traceTransaction - negative case', async () => {
            for (const fixture of fixture_1.debugTraceTransactionNegativeCasesFixtureTestnet) {
                await (0, globals_1.expect)(async () => {
                    await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceTransaction](fixture.input.params);
                }).rejects.toThrowError(fixture.input.expectedError);
            }
        });
    });
});
