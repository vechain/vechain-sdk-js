import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import { ethGetBlockByHashTestCases } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByHash
 */
describe('RPC Mapper - eth_getBlockByHash method tests', () => {
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
     * eth_getBlockByHash RPC call tests - Negative cases
     */
    describe('Negative cases', () => {
        /**
         * Test case where request fails
         */
        test('Should throw `JSONRPCInternalError` when request fails', async () => {
            // Mock the getBlock method to throw error
            jest.spyOn(thorClient.blocks, 'getBlockExpanded').mockRejectedValue(
                new Error()
            );

            jest.spyOn(
                thorClient.blocks,
                'getBlockCompressed'
            ).mockRejectedValue(new Error());

            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockByHash
                    ](ethGetBlockByHashTestCases[0].params)
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
