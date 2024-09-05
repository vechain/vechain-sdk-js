import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'net_peerCount' method
 *
 * @group integration/rpc-mapper/methods/net_peerCount
 */
describe('RPC Mapper - net_peerCount method tests', () => {
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
     * net_peerCount RPC call tests - Negative cases
     */
    describe('Negative cases', () => {
        /**
         * Test case where request fails
         */
        test('Should throw `JSONRPCInternalError` when request fails', async () => {
            // Mock the getBlock method to throw error
            jest.spyOn(thorClient.nodes, 'getNodes').mockRejectedValue(
                new Error()
            );

            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.net_peerCount](
                        []
                    )
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
