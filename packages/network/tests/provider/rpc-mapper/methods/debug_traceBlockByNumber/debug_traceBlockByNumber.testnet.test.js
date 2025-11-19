"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * RPC Mapper integration tests for 'debug_traceBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/debug_traceBlockByNumber
 */
(0, globals_1.describe)('RPC Mapper - debug_traceBlockByNumber method tests', () => {
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
     * debug_traceBlockByNumber RPC call tests - Positive cases
     */
    (0, globals_1.describe)('debug_traceBlockByNumber - Positive cases', () => {
        /**
         * Should return traces for the block.
         */
        (0, globals_1.test)('Should return traces for the block', async () => {
            for (const debugTraceBlockByNumberFixtureElement of fixture_1.debugTraceBlockByNumberFixture) {
                // Get traces
                const traces = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByNumber](debugTraceBlockByNumberFixtureElement.input.params);
                // Compare
                (0, globals_1.expect)(traces).toEqual(debugTraceBlockByNumberFixtureElement.expected);
            }
        }, 30000);
    });
    /**
     * debug_traceTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('debug_traceTransaction - Negative cases', () => {
        /**
         * Should throw an error if the input params are invalid.
         */
        (0, globals_1.test)('Should throw an error if the input params are invalid', async () => {
            // No params
            await (0, globals_1.expect)(async () => {
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByNumber]([]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Invalid block hash
            await (0, globals_1.expect)(async () => {
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByNumber]([
                    'INVALID_BLOCK_NUMBER',
                    {
                        tracer: 'presStateTracer',
                        tracerConfig: { onlyTopCall: true }
                    }
                ]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
            // No options
            await (0, globals_1.expect)(async () => {
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByNumber]([sdk_core_1.HexInt.of(17727716).toString()]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
