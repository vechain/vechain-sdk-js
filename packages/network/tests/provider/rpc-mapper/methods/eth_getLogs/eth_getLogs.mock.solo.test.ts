import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    type LogsRPC,
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient,
    type SimpleHttpClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import { logsFixture, mockLogsFixture } from './fixture';
import { retryOperation } from '../../../../test-utils';

/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs-mock
 */
describe('RPC Mapper - eth_getLogs method tests', () => {
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
     * eth_getLogs RPC call tests - Positive cases
     */
    describe('eth_getLogs - Positive cases', () => {
        /**
         * Positive cases. Should be able to get logs
         */
        mockLogsFixture.forEach((fixture, index) => {
            test(`eth_getLogs - Should be able to get logs test - ${index + 1}`, async () => {
                // Mock the HTTP client to return empty logs
                mockHttpClient.http.mockResolvedValue([]);

                // Call RPC method
                const logs = (await retryOperation(
                    async () =>
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getLogs
                        ]([fixture.input])
                )) as LogsRPC[];

                expect(logs.slice(0, 4)).toStrictEqual(fixture.expected);
            }, 6000);
        });
    });

    /**
     * eth_getLogs RPC call tests - Negative cases
     */
    describe('eth_getLogs - Negative cases', () => {
        /**
         * Negative case 2 - Should throw an error for invalid input if request is invalid
         */
        test('eth_getLogs - Should throw error if request is invalid', async () => {
            // Mock the HTTP client to throw an error
            mockHttpClient.http.mockRejectedValue(
                new Error('Connection failed')
            );

            await expect(
                async () =>
                    // Call RPC method
                    (await retryOperation(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getLogs
                            ]([logsFixture[0].input])
                    )) as LogsRPC[]
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
