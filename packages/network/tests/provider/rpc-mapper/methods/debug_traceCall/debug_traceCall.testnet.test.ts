import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    debugTraceCallNegativeCasesFixtureTestnet,
    debugTraceCallPositiveCasesFixtureTestnet
} from './fixture';

/**
 * RPC Mapper integration tests for 'debug_traceCall' method on testnet
 *
 * @group integration/rpc-mapper/methods/debug_traceCall-testnet
 */
describe('RPC Mapper - debug_traceCall method tests testnet', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * debug_traceCall RPC call tests - Positive cases
     */
    describe('debug_traceCall - Positive cases', () => {
        /**
         * Positive cases
         */
        test('debug_traceCall - positive cases', async () => {
            for (const fixture of debugTraceCallPositiveCasesFixtureTestnet) {
                const result = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceCall
                ](fixture.input.params);
                expect(result).toEqual(fixture.input.expected);
            }
        });

        /**
         * Should be able to trace a call with callTracer
         */
        test('debug_traceCall - Should be able to trace a call with callTracer', async () => {
            const fixtureTransaction =
                debugTraceCallPositiveCasesFixtureTestnet[0];

            const result = await RPCMethodsMap(thorClient)[
                RPC_METHODS.debug_traceCall
            ]([
                fixtureTransaction.input.params[0],
                fixtureTransaction.input.params[1],
                { tracer: 'callTracer' }
            ]);
            expect(result).toBeDefined();
        });
    });

    /**
     * debug_traceCall RPC call tests - Negative cases
     */
    describe('debug_traceCall - Negative cases', () => {
        /**
         * Negative cases
         */
        test('debug_traceCall - negative cases', async () => {
            for (const fixture of debugTraceCallNegativeCasesFixtureTestnet) {
                await expect(async () => {
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_traceCall
                    ](fixture.input.params);
                }).rejects.toThrowError(fixture.input.expectedError);
            }
        });
    });
});
