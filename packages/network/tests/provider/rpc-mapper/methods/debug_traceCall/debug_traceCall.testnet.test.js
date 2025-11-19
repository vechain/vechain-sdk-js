"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
/**
 * RPC Mapper integration tests for 'debug_traceCall' method on testnet
 *
 * @group integration/rpc-mapper/methods/debug_traceCall-testnet
 */
(0, globals_1.describe)('RPC Mapper - debug_traceCall method tests testnet', () => {
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
     * debug_traceCall RPC call tests - Positive cases
     */
    (0, globals_1.describe)('debug_traceCall - Positive cases', () => {
        /**
         * Positive cases
         */
        (0, globals_1.test)('debug_traceCall - positive cases', async () => {
            for (const fixture of fixture_1.debugTraceCallPositiveCasesFixtureTestnet) {
                const result = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceCall](fixture.input.params);
                (0, globals_1.expect)(result).toEqual(fixture.input.expected);
            }
        });
        /**
         * Should be able to trace a call with callTracer
         */
        (0, globals_1.test)('debug_traceCall - Should be able to trace a call with callTracer', async () => {
            const fixtureTransaction = fixture_1.debugTraceCallPositiveCasesFixtureTestnet[0];
            const result = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceCall]([
                fixtureTransaction.input.params[0],
                fixtureTransaction.input.params[1],
                { tracer: 'callTracer' }
            ]);
            (0, globals_1.expect)(result).toBeDefined();
        });
    });
    /**
     * debug_traceCall RPC call tests - Negative cases
     */
    (0, globals_1.describe)('debug_traceCall - Negative cases', () => {
        /**
         * Negative cases
         */
        (0, globals_1.test)('debug_traceCall - negative cases', async () => {
            for (const fixture of fixture_1.debugTraceCallNegativeCasesFixtureTestnet) {
                await (0, globals_1.expect)(async () => {
                    await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceCall](fixture.input.params);
                }).rejects.toThrowError(fixture.input.expectedError);
            }
        });
    });
});
