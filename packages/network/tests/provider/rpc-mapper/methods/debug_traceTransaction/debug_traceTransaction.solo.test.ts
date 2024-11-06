import { beforeEach, describe, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { sendTransactionWithAccountIndex } from '../../../../thor-client/debug/fixture-thorest';

/**
 * RPC Mapper integration tests for 'debug_traceTransaction' method.
 * Since prestateTracer is not available on testnet, we only test the solo network.
 *
 * @group integration/rpc-mapper/methods/debug_traceTransaction-solo
 */
describe('RPC Mapper - debug_traceTransaction method tests - solo', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * debug_traceTransaction RPC call tests - Positive cases
     */
    describe('debug_traceTransaction - Positive cases', () => {
        /**
         * Positive cases - presetTracer
         */
        test('debug_traceTransaction - prestate tracer', async () => {
            const txReceipt = await sendTransactionWithAccountIndex(
                18,
                thorClient
            );

            const result = await RPCMethodsMap(thorClient)[
                RPC_METHODS.debug_traceTransaction
            ]([
                txReceipt?.meta.txID,
                {
                    tracer: 'prestateTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ]);
            expect(result).toBeDefined();
        }, 30000);
    });
});
