"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const fixture_thorest_1 = require("../../../../thor-client/debug/fixture-thorest");
const fixture_1 = require("../../../../thor-client/transactions/fixture");
const fixture_2 = require("../../../../fixture");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'debug_traceCall' method on solo
 * Since prestateTracer is not available on testnet, we only test the solo network.
 *
 * @group integration/rpc-mapper/methods/debug_traceCall-solo
 */
(0, globals_1.describe)('RPC Mapper - debug_traceCall method tests on solo', () => {
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
     * debug_traceCall RPC call tests - Positive cases
     */
    (0, globals_1.describe)('debug_traceCall - Positive cases', () => {
        /**
         * Should be able to trace a call with prestateTracer
         */
        (0, globals_1.test)('debug_traceCall - Should be able to trace a call with prestateTracer', async () => {
            const txReceipt = await (0, fixture_thorest_1.sendTransactionWithAccount)(fixture_2.TEST_ACCOUNTS.ACCOUNT.DEBUG_TRACE_CALL_ACCOUNT, thorClient);
            const result = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.debug_traceCall]([
                {
                    from: txReceipt?.meta.txOrigin,
                    // VTHO contract address
                    to: fixture_thorest_1.traceContractCallTestnetFixture.positiveCases[0]
                        .to,
                    value: '0x0',
                    // Transfer 1 VTHO clause
                    data: fixture_1.transfer1VTHOClause.data,
                    gas: '0x0'
                },
                'latest',
                {
                    tracer: 'prestateTracer',
                    tracerConfig: {
                        onlyTopCall: true
                    }
                }
            ]));
            (0, globals_1.expect)(result).toBeDefined();
        }, 50000);
    });
});
