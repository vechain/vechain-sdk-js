import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import { HexInt } from '@vechain/sdk-core';

/**
 * RPC Mapper integration tests for 'debug_traceBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/debug_traceBlockByNumber-mock
 */
describe('RPC Mapper - debug_traceBlockByNumber method mock tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * debug_traceTransaction RPC call tests - Negative cases
     */
    describe('debug_traceBlockByNumber - Negative cases', () => {
        /**
         * Should return [] if blockHash does not exist
         */
        test('Should return [] if blockHash does not exist', async () => {
            // Mock the getBlockCompressed method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBlockCompressed'
            ).mockResolvedValue(null);

            // Get traces
            const traces = await RPCMethodsMap(thorClient)[
                RPC_METHODS.debug_traceBlockByNumber
            ]([
                HexInt.of(17727716).toString(),
                {
                    tracer: 'presStateTracer',
                    tracerConfig: { onlyTopCall: true }
                }
            ]);

            expect(traces).toEqual([]);
        });

        /**
         * Should throw `JSONRPCInternalError` if an error occurs while tracing the block
         */
        test('Should throw `JSONRPCInternalError` if an error occurs while tracing the block', async () => {
            // Mock the getBlockCompressed method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBlockCompressed'
            ).mockRejectedValue(new Error());

            // Get traces
            await expect(async () => {
                await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByNumber
                ]([
                    HexInt.of(17727716).toString(),
                    {
                        tracer: 'presStateTracer',
                        tracerConfig: { onlyTopCall: true }
                    }
                ]);
            }).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
