import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { mockLogsFixture } from './fixture';
import { type LogsRPC } from '../../../../../src/provider/utils/formatter/logs/types';

/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs
 */
describe('RPC Mapper - eth_getLogs method tests', () => {
    // Add retry configuration for all tests in this suite
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

    // Increase timeout for RPC tests
    const TIMEOUT = 30000; // 30 seconds

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
         * Test cases for eth_getLogs RPC method
         */
        mockLogsFixture.forEach((fixture, index) => {
            test(
                `eth_getLogs - Should be able to get logs test - ${index + 1}`,
                async () => {
                    const rpcCall = (await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getLogs
                    ]([fixture.input])) as LogsRPC[];
                    expect(rpcCall.slice(0, 4)).toStrictEqual(fixture.expected);
                },
                TIMEOUT
            );
        });
    });
});
