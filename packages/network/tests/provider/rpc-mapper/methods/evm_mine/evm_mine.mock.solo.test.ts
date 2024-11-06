import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';

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
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * evm_mine RPC call tests - Negative cases
     */
    describe('evm_mine - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        test('Should throw `JSONRPCInternalError` if an error occurs while retrieving the block number', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockExpanded'
            ).mockRejectedValue(new Error());

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.evm_mine]([])
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Test case that mocks an error thrown by the waitForBlockCompressed method
         */
        test('Should throw `ProviderRpcError` if an error occurs while waiting for the new block', async () => {
            // Mock the waitForBlockCompressed method to return null
            jest.spyOn(
                thorClient.blocks,
                'waitForBlockCompressed'
            ).mockResolvedValue(null);

            const newBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.evm_mine
            ]([]);
            expect(newBlock).toBeNull();
        });

        /**
         * Should return null if the best block is null
         */
        test('Should return null if the best block is null', async () => {
            // Mock the getBestBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockExpanded'
            ).mockResolvedValue(null);

            const newBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.evm_mine
            ]([]);
            expect(newBlock).toBeNull();
        });
    });
});
