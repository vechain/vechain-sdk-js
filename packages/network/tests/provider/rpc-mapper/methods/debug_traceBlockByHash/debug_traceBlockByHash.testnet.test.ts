import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { debugTraceBlockByHashFixture } from './fixture';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'debug_traceBlockByHash' method
 *
 * @group integration/rpc-mapper/methods/debug_traceBlockByHash
 */
describe('RPC Mapper - debug_traceBlockByHash method tests', () => {
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
     * debug_traceBlockByHash RPC call tests - Positive cases
     */
    describe('debug_traceBlockByHash - Positive cases', () => {
        /**
         * Should return traces for the block.
         */
        test('Should return traces for the block', async () => {
            for (const debugTraceBlockByHashFixtureElement of debugTraceBlockByHashFixture) {
                // Get traces
                const traces = await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByHash
                ](debugTraceBlockByHashFixtureElement.input.params);

                // Compare
                expect(traces).toEqual(
                    debugTraceBlockByHashFixtureElement.expected
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
                    RPC_METHODS.debug_traceBlockByHash
                ]([]);
            }).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid block hash
            await expect(async () => {
                await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByHash
                ]([
                    'INVALID_BLOCK_HASH',
                    {
                        tracer: 'presStateTracer',
                        tracerConfig: { onlyTopCall: true }
                    }
                ]);
            }).rejects.toThrowError(JSONRPCInvalidParams);

            // No options
            await expect(async () => {
                await RPCMethodsMap(thorClient)[
                    RPC_METHODS.debug_traceBlockByHash
                ]([
                    '0x010e80e4c2b06efb61a86f33155d7a1e3f3bd2ae7b676e7d62270079bd1fe329'
                ]);
            }).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
