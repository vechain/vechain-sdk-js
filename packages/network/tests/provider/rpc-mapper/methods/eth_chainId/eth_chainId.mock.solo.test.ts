import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { BlockGenesisNotFound, ProviderRpcError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { soloUrl } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId-mock-solo
 */
describe('RPC Mapper - eth_chainId method tests mock on solo', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(soloUrl);
    });

    /**
     * eth_chainId RPC call tests - Negative cases
     */
    describe('eth_chainId - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getGenesisBlock method
         */
        test('Should throw `ProviderRpcError` if an error occurs while retrieving the chain id', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockRejectedValue(
                new Error()
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_chainId]([])
            ).rejects.toThrowError(ProviderRpcError);
        });

        /**
         * Test case where the genesis block is not defined
         */
        test('Should return `0x0` if the genesis block is not defined', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockRejectedValue(
                BlockGenesisNotFound
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_chainId]([])
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
