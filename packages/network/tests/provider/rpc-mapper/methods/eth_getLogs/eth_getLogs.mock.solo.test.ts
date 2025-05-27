import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type LogsRPC,
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import { logsFixture, mockLogsFixture } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs-mock
 */
describe('RPC Mapper - eth_getLogs method tests', () => {
    // Add retry configuration for all tests in this suite
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

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
     * eth_getLogs RPC call tests - Positive cases
     */
    describe('eth_getLogs - Positive cases', () => {
        /**
         * Positive cases. Should be able to get logs
         */
        mockLogsFixture.forEach((fixture, index) => {
            test(`eth_getLogs - Should be able to get logs test - ${index + 1}`, async () => {
                // Mock the getGenesisBlock method to return null
                jest.spyOn(
                    thorClient.logs,
                    'filterRawEventLogs'
                ).mockResolvedValue([]);

                // Call RPC method
                const logs = (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getLogs
                ]([fixture.input])) as LogsRPC[];

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
            // Mock the filterGroupedEventLogs method to throw error
            jest.spyOn(thorClient.logs, 'filterRawEventLogs').mockRejectedValue(
                new Error()
            );

            await expect(
                async () =>
                    // Call RPC method
                    (await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getLogs]([
                        logsFixture[0].input
                    ])) as LogsRPC[]
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
