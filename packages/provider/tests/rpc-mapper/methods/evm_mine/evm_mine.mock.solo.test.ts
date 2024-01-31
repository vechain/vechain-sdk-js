import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'evm_mine' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/evm_mine
 */
describe('RPC Mapper - evm_mine method tests', () => {
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
     * evm_mine RPC call tests - Negative cases
     */
    describe('evm_mine - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        test('Should throw `ProviderRpcError` if an error occurs while retrieving the block number', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.blocks, 'getBestBlock').mockRejectedValue(
                new Error()
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.evm_mine]([])
            ).rejects.toThrowError(ProviderRpcError);
        });
    });
});
