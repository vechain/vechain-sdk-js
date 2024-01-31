import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_syncing' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_syncing
 */
describe('RPC Mapper - eth_syncing method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(soloNetwork);
    });

    /**
     * eth_syncing RPC call tests - Negative cases
     */
    describe('eth_syncing - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        test('Should throw `ProviderRpcError` if an error occurs while retrieving the best block', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.blocks, 'getBestBlock').mockRejectedValue(
                new Error()
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_syncing]([])
            ).rejects.toThrowError(ProviderRpcError);
        });

        /**
         * Test case that mocks an error thrown by the getGenesisBlock method
         */
        test('Should throw `ProviderRpcError` if an error occurs while retrieving the genesis block', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockRejectedValue(
                new Error()
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_syncing]([])
            ).rejects.toThrowError(ProviderRpcError);
        });

        /**
         * Test case where the best block is not defined
         */
        test('Should return an object with the sync status of the node if the node is out-of-sync', async () => {
            // Mock the getBestBlock method to return null
            jest.spyOn(thorClient.blocks, 'getBestBlock').mockResolvedValue(
                null
            );

            const status = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_syncing
            ]([])) as string;

            expect(status).not.toBe(false);
        });
    });
});
