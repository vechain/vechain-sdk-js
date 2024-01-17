import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'net_version' method
 *
 * @group integration/rpc-mapper/methods/net_version
 */
describe('RPC Mapper - net_version method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Inti thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destory thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * net_version RPC call tests - Negative cases
     */
    describe('net_version - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getGenesisBlock method
         */
        test('Should throw `ProviderRpcError` if an error occurs while retrieving the network id', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockRejectedValue(
                new Error()
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.net_version]([])
            ).rejects.toThrowError(ProviderRpcError);
        });

        /**
         * Test case where the genesis block is not defined
         */
        // test('Should return `0` if the genesis block is not defined', async () => {
        //     // Mock the getGenesisBlock method to return null
        //     jest.spyOn(thorClient.blocks, 'getGenesisBlock').mockResolvedValue(
        //         null
        //     );

        //     const rpcCallNetVersion = (await RPCMethodsMap(thorClient)[
        //         RPC_METHODS.net_version
        //     ]([])) as string;

        //     expect(rpcCallNetVersion).toBe('0');
        // });
    });
});
