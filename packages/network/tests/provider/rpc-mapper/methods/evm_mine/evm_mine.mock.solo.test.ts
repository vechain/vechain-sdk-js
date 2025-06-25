import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient,
    type SimpleHttpClient
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
    let mockHttpClient: jest.Mocked<SimpleHttpClient>;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Create a mock HTTP client
        mockHttpClient = {
            baseURL: THOR_SOLO_URL,
            headers: new Headers(),
            timeout: 10000,
            get: jest.fn(),
            post: jest.fn(),
            http: jest.fn()
        } as unknown as jest.Mocked<SimpleHttpClient>;

        // Create thor client with mock HTTP client
        thorClient = new ThorClient(mockHttpClient);
    });

    /**
     * evm_mine RPC call tests - Negative cases
     */
    describe('evm_mine - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        test('Should throw `JSONRPCInternalError` if an error occurs while retrieving the block number', async () => {
            // Mock the HTTP client to throw an error
            mockHttpClient.http.mockRejectedValue(
                new Error('Connection failed')
            );

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.evm_mine]([])
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Test case that mocks an error thrown by the waitForBlockCompressed method
         */
        test('Should throw `JSONRPCInternalError` if an error occurs while waiting for the new block', async () => {
            // Mock the HTTP client to return a block first, then throw an error
            mockHttpClient.http
                .mockResolvedValueOnce({ number: 1 }) // First call succeeds
                .mockRejectedValueOnce(new Error('Connection failed')); // Second call fails

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.evm_mine]([])
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Should return null if the best block is null
         */
        test('Should return null if the best block is null', async () => {
            // Mock the HTTP client to return null
            mockHttpClient.http.mockResolvedValue(null);

            const newBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.evm_mine
            ]([]);
            expect(newBlock).toBeNull();
        });
    });
});
