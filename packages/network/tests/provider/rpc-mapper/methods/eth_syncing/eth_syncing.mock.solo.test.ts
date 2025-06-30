import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import {
    mockedNotOutOfSyncBestBlockFixture,
    mockedOutOfSyncBestBlockFixture
} from './fixture';
import { retryOperation } from '../../../../test-utils';

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
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * eth_syncing RPC call tests - Positive cases
     */
    describe('eth_syncing - Positive cases', () => {
        /**
         * Positive case 1 - NOT out of sync
         */
        test('eth_syncing - Should return false with NOT out of sync best block', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockCompressed'
            ).mockResolvedValue(mockedNotOutOfSyncBestBlockFixture);

            const status = await retryOperation(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_syncing]([])
            );
            expect(status).toBe(false);
        });

        /**
         * Positive case 2 - OUT of sync
         */
        test('eth_syncing - Should return sync status with out of sync best block', async () => {
            // Mock the getGenesisBlock method to return null
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockCompressed'
            ).mockResolvedValue(mockedOutOfSyncBestBlockFixture);

            const status = await retryOperation(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_syncing]([])
            );
            expect(status).not.toBe(false);
            expect(status).toHaveProperty('currentBlock');
            expect(status).toHaveProperty('highestBlock');
            expect(status).toHaveProperty('startingBlock');
        });
    });

    /**
     * eth_syncing RPC call tests - Negative cases
     */
    describe('eth_syncing - Negative cases', () => {
        /**
         * Cases when error is thrown
         */
        describe('eth_syncing - Error throws', () => {
            /**
             * Test case that mocks an error thrown by the getBestBlock method
             */
            test('Should throw `JSONRPCInternalError` if an error occurs while retrieving the best block', async () => {
                // Mock the getGenesisBlock method to return null
                jest.spyOn(
                    thorClient.blocks,
                    'getBestBlockCompressed'
                ).mockRejectedValue(new Error());

                await expect(
                    retryOperation(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_syncing
                            ]([])
                    )
                ).rejects.toThrowError(JSONRPCInternalError);
            });

            /**
             * Test case that mocks an error thrown by the getGenesisBlock method
             */
            test('Should throw `JSONRPCInternalError` if an error occurs while retrieving the genesis block', async () => {
                // Mock the getGenesisBlock method to return null
                jest.spyOn(
                    thorClient.blocks,
                    'getGenesisBlock'
                ).mockRejectedValue(new Error());

                await expect(
                    retryOperation(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_syncing
                            ]([])
                    )
                ).rejects.toThrowError(JSONRPCInternalError);
            });

            /**
             * Cases when error is thrown
             */
            describe('eth_syncing - Null values fetched for best and genesis block', () => {
                /**
                 * Test case where the best block and genesis block are not defined
                 */
                test('Should return an object with the sync status of the node if the node is out-of-sync and with null best and genesis block', async () => {
                    // Mock the getBestBlock method to return null
                    jest.spyOn(
                        thorClient.blocks,
                        'getBestBlockCompressed'
                    ).mockResolvedValue(null);

                    // Mock the getGenesisBlock method to return null
                    jest.spyOn(
                        thorClient.blocks,
                        'getGenesisBlock'
                    ).mockResolvedValue(null);

                    const status = (await retryOperation(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_syncing
                            ]([])
                    )) as string;

                    expect(status).not.toBe(false);
                });
            });
        });
    });
});
