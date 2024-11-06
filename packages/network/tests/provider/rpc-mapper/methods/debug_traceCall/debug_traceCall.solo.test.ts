import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import {
    sendTransactionWithAccountIndex,
    traceContractCallTestnetFixture
} from '../../../../thor-client/debug/fixture-thorest';
import { transfer1VTHOClause } from '../../../../thor-client/transactions/fixture';

/**
 * RPC Mapper integration tests for 'debug_traceCall' method on solo
 * Since prestateTracer is not available on testnet, we only test the solo network.
 *
 * @group integration/rpc-mapper/methods/debug_traceCall-solo
 */
describe('RPC Mapper - debug_traceCall method tests on solo', () => {
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
     * debug_traceCall RPC call tests - Positive cases
     */
    describe('debug_traceCall - Positive cases', () => {
        /**
         * Should be able to trace a call with prestateTracer
         */
        test('debug_traceCall - Should be able to trace a call with prestateTracer', async () => {
            const txReceipt = await sendTransactionWithAccountIndex(
                19,
                thorClient
            );

            const result = await RPCMethodsMap(thorClient)[
                RPC_METHODS.debug_traceCall
            ]([
                {
                    from: txReceipt?.meta.txOrigin,
                    // VTHO contract address
                    to: traceContractCallTestnetFixture.positiveCases[0].to,
                    value: '0x0',
                    // Transfer 1 VTHO clause
                    data: transfer1VTHOClause.data,
                    gas: '0x0'
                },
                'latest',
                {
                    tracer: 'prestateTracer',
                    tracerConfig: {
                        onlyTopCall: true
                    }
                }
            ]);
            expect(result).toBeDefined();
        }, 30000);
    });
});
