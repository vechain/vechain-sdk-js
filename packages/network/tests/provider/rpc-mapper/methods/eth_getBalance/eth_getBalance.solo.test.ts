import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import {
    ethGetBalanceTestCases,
    invalidEthGetBalanceTestCases
} from './fixture';
import { TEST_ACCOUNTS } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getBalance' method
 *
 * @group integration/rpc-mapper/methods/eth_getBalance
 */
describe('RPC Mapper - eth_getBalance method tests', () => {
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
     * eth_getBalance RPC call tests - Positive cases
     */
    describe('eth_getBalance - Positive cases', () => {
        /**
         * Test cases for eth_getBalance RPC method that do not throw an error
         */
        ethGetBalanceTestCases.forEach(({ description, params, expected }) => {
            test(
                description,
                async () => {
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getBalance
                        ](params);

                    // Compare the result with the expected value
                    expect(rpcCall).toStrictEqual(expected);
                },
                TIMEOUT
            );
        });

        /**
         * Test cases for eth_getBalance RPC method that throw an error
         */
        invalidEthGetBalanceTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(
                    description,
                    async () => {
                        // Call RPC method
                        await expect(
                            RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getBalance
                            ](params)
                        ).rejects.toThrowError(expectedError);
                    },
                    TIMEOUT
                );
            }
        );

        /**
         * Should return correct balance of the test account
         */
        test(
            'Should return correct balance of the test account',
            async () => {
                // Call RPC method
                const rpcCall = (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getBalance
                ]([
                    TEST_ACCOUNTS.ACCOUNT.SIMPLE_ACCOUNT.address,
                    'latest'
                ])) as string;

                // Check if the result matches the expected value
                expect(rpcCall).toBeDefined();
                expect(typeof rpcCall).toBe('string');
                expect(rpcCall.startsWith('0x')).toBe(true);
            },
            TIMEOUT
        );
    });

    /**
     * eth_getBalance RPC call tests - Negative cases
     */
    describe('eth_getBalance - Negative cases', () => {});
});
