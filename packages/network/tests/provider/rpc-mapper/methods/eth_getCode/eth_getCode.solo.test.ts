import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { ethGetCodeTestCases, invalidEthGetCodeTestCases } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getCode' method - Solo Network
 *
 * @group integration/rpc-mapper/methods/eth_getCode
 */
describe('RPC Mapper - eth_getCode method tests', () => {
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
     * eth_getCode RPC call tests - Positive cases
     */
    describe('eth_getCode - Positive cases', () => {
        /**
         * Test cases for eth_getCode RPC method that do not throw an error
         */
        ethGetCodeTestCases.forEach(({ description, params, expected }) => {
            test(
                description,
                async () => {
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getCode
                        ](params);

                    // Compare the result with the expected value
                    expect(rpcCall).toStrictEqual(expected);
                },
                TIMEOUT
            );
        });
    });

    /**
     * eth_getCode RPC call tests - Negative cases
     */
    describe('eth_getCode - Negative cases', () => {
        /**
         * Test cases for eth_getCode RPC method that throw an error
         */
        invalidEthGetCodeTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(`${description}`, async () => {
                    await expect(
                        RPCMethodsMap(thorClient)[RPC_METHODS.eth_getCode](
                            params
                        )
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
