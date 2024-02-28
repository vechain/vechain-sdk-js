import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_blockNumber' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/eth_blockNumber
 */
describe('RPC Mapper - eth_blockNumber method tests', () => {
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
     * eth_blockNumber RPC call tests - Negative cases
     */
    describe('eth_blockNumber - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        test('Should throw `ProviderRpcError` if an error occurs while retrieving the block number', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockCompressed'
            ).mockRejectedValue(new Error());

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_blockNumber]([])
            ).rejects.toThrowError(ProviderRpcError);
        });

        /**
         * Test case where the best block is not defined
         */
        test('Should return `0x0` if the genesis block is not defined', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockCompressed'
            ).mockResolvedValue(null);

            const rpcCallChainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_blockNumber
            ]([])) as string;

            expect(rpcCallChainId).toBe('0x0');
        });
    });
});
