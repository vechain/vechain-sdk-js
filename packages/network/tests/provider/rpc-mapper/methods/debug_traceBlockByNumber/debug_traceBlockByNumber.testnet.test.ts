import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { debugTraceBlockByNumberFixture } from './fixture';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { HexInt } from '@vechain/sdk-core';

/**
 * RPC Mapper integration tests for 'debug_traceBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/debug_traceBlockByNumber
 */
describe('RPC Mapper - debug_traceBlockByNumber method tests', () => {
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
     * debug_traceBlockByNumber RPC call tests - Positive cases
     */
    describe('debug_traceBlockByNumber - Positive cases', () => {
        /**
         * Should return traces for the block.
         */
        test('Should return traces for the block', async () => {
            for (const debugTraceBlockByNumberFixtureElement of debugTraceBlockByNumberFixture) {
                // Get traces
                const traces = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByNumber
                ](debugTraceBlockByNumberFixtureElement.input.params);

                console.log('traces', traces);

                // Compare
                expect(traces).toEqual(
                    debugTraceBlockByNumberFixtureElement.expected
                );
            }
        }, 10000);
    });

    /**
     * debug_traceTransaction RPC call tests - Negative cases
     */
    describe('debug_traceTransaction - Negative cases', () => {
        /**
         * Should throw an error if the input params are invalid.
         */
        test('Should throw an error if the input params are invalid', async () => {
            // No params
            await expect(async () => {
                await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByNumber
                ]([]);
            }).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid block hash
            await expect(async () => {
                await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByNumber
                ]([
                    'INVALID_BLOCK_NUMBER',
                    {
                        tracer: 'presStateTracer',
                        tracerConfig: { onlyTopCall: true }
                    }
                ]);
            }).rejects.toThrowError(JSONRPCInternalError);

            // No options
            await expect(async () => {
                await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByNumber
                ]([HexInt.of(17727716).toString()]);
            }).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
