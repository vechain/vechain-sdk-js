"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'debug_traceBlockByHash' method
 *
 * @group integration/rpc-mapper/methods/debug_traceBlockByHash-mock
 */
(0, globals_1.describe)('RPC Mapper - debug_traceBlockByHash method mock tests', () => {
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
     * debug_traceTransaction RPC call tests - Negative cases
     */
    (0, globals_1.describe)('debug_traceTransaction - Negative cases', () => {
        /**
         * Should return [] if blockHash does not exist
         */
        (0, globals_1.test)('Should return [] if blockHash does not exist', async () => {
            // Mock the getBlockCompressed method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBlockCompressed').mockResolvedValue(null);
            // Get traces
            const traces = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByHash]([
                '0x010e80e4c2b06efb61a86f33155d7a1e3f3bd2ae7b676e7d62270079bd1fe329',
                {
                    tracer: 'presStateTracer',
                    tracerConfig: { onlyTopCall: true }
                }
            ]);
            (0, globals_1.expect)(traces).toEqual([]);
        });
        /**
         * Should throw `JSONRPCInternalError` if an error occurs while tracing the block
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` if an error occurs while tracing the block', async () => {
            // Mock the getBlockCompressed method to return null
            globals_1.jest.spyOn(thorClient.blocks, 'getBlockCompressed').mockRejectedValue(new Error());
            // Get traces
            await (0, globals_1.expect)(async () => {
                await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceBlockByHash]([
                    '0x010e80e4c2b06efb61a86f33155d7a1e3f3bd2ae7b676e7d62270079bd1fe329',
                    {
                        tracer: 'presStateTracer',
                        tracerConfig: { onlyTopCall: true }
                    }
                ]);
            }).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
