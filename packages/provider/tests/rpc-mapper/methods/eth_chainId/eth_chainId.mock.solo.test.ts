import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId
 */
describe('RPC Mapper - eth_chainId method tests', () => {
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
            jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValue(
                null
            );

            const rpcCallChainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            expect(rpcCallChainId).toBe('0x0');
        });
    });
});
