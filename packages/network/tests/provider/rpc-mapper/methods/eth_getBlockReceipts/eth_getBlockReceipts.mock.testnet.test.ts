import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getBlockReceipts' method
 *
 * @group integration/sdk-network/rpc-mapper/methods/eth_getBlockReceipts-mock
 */
describe('RPC Mapper - eth_getBlockReceipts mock method tests', () => {
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
     * eth_getBlockReceipts RPC call tests - Positive cases
     */
    describe('eth_getBlockReceipts - Positive cases', () => {
        /**
         * Positive case 1 - Simple block receipts retrieval
         */
        test('Should return null if the fetched block is null', async () => {
            // Mock the estimateGas method to return null
            jest.spyOn(thorClient.blocks, 'getBlockExpanded').mockResolvedValue(
                null
            );

            // Call RPC function
            const rpcCall = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockReceipts
            ](['latest']);

            // Compare the result with the expected value
            expect(rpcCall).toEqual(null);
        });
    });

    /**
     * eth_getBlockReceipts RPC call tests - Negative cases
     */
    describe('eth_getBlockReceipts - Negative cases', () => {
        /**
         * Negative case 1 - Throws error if any error occurs while fetching block number
         */
        test('Should throw error if errors while fetching block number', async () => {
            // Mock the estimateGas method to return null
            jest.spyOn(thorClient.blocks, 'getBlockExpanded').mockRejectedValue(
                new Error()
            );

            // Call RPC function and expect an error
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockReceipts
                    ](['latest'])
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
