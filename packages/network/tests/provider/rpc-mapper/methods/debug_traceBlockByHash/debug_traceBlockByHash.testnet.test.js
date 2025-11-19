"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'debug_traceBlockByHash' method
 *
 * @group integration/rpc-mapper/methods/debug_traceBlockByHash
 */
(0, globals_1.describe)('RPC Mapper - debug_traceBlockByHash method tests', () => {
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
     * debug_traceBlockByHash RPC call tests - Positive cases
     */
    (0, globals_1.describe)('debug_traceBlockByHash - Positive cases', () => {
        /**
         * Should return traces for the block.
         */
        (0, globals_1.test)('Should return traces for the block', async () => {
            for (const debugTraceBlockByHashFixtureElement of fixture_1.debugTraceBlockByHashFixture) {
                // Get traces
                const traces = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByHash](debugTraceBlockByHashFixtureElement.input.params);
                // Compare
                (0, globals_1.expect)(traces).toEqual(debugTraceBlockByHashFixtureElement.expected);
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
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByHash]([]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Invalid block hash
            await (0, globals_1.expect)(async () => {
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByHash]([
                    'INVALID_BLOCK_HASH',
                    {
                        tracer: 'presStateTracer',
                        tracerConfig: { onlyTopCall: true }
                    }
                ]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // No options
            await (0, globals_1.expect)(async () => {
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByHash]([
                    '0x010e80e4c2b06efb61a86f33155d7a1e3f3bd2ae7b676e7d62270079bd1fe329'
                ]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
