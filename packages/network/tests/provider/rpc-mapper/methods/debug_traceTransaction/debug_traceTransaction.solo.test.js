"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_thorest_1 = require("../../../../thor-client/debug/fixture-thorest");
const fixture_1 = require("../../../../fixture");
/**
 * RPC Mapper integration tests for 'debug_traceTransaction' method.
 * Since prestateTracer is not available on testnet, we only test the solo network.
 *
 * @group integration/rpc-mapper/methods/debug_traceTransaction-solo
 */
(0, globals_1.describe)('RPC Mapper - debug_traceTransaction method tests - solo', () => {
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
     * debug_traceTransaction RPC call tests - Positive cases
     */
    (0, globals_1.describe)('debug_traceTransaction - Positive cases', () => {
        /**
         * Positive cases - presetTracer
         */
        (0, globals_1.test)('debug_traceTransaction - prestate tracer', async () => {
            // Retry mechanism for connection issues
            let lastError = null;
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const txReceipt = await (0, fixture_thorest_1.sendTransactionWithAccount)(fixture_1.TEST_ACCOUNTS.ACCOUNT.DEBUG_TRACE_TRANSACTION_ACCOUNT, thorClient);
                    const result = await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceTransaction]([
                        txReceipt?.meta.txID,
                        {
                            tracer: 'prestateTracer',
                            timeout: '10s',
                            tracerConfig: { onlyTopCall: true }
                        }
                    ]);
                    expect(result).toBeDefined();
                    // Success - exit retry loop
                    return;
                }
                catch (error) {
                    lastError = error;
                    if (attempt < 3) {
                        // Wait 3 seconds before retrying
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                    }
                }
            }
            // All retries failed
            throw lastError ?? new Error('Connection failed after 3 attempts');
        }, 45000);
    });
});
