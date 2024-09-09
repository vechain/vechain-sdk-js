import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'net_listening' method
 *
 * @group integration/rpc-mapper/methods/net_listening
 */
describe('RPC Mapper - net_listening method tests', () => {
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
     * net_listening RPC call tests - Negative cases
     */
    describe('Negative cases', () => {
        /**
         * Test case where request fails
         */
        test('Should throw `JSONRPCInternalError` when request fails', async () => {
            // Mock the getBlock method to throw error
            jest.spyOn(thorClient.nodes, 'isHealthy').mockRejectedValue(
                new Error()
            );

            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.net_listening](
                        []
                    )
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
