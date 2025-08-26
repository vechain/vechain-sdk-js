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
import { retryOperation } from '../../../../test-utils';

/**
 * RPC Mapper integration tests for 'eth_getBalance' method
 *
 * @group integration/rpc-mapper/methods/eth_getBalance
 */
describe('RPC Mapper - eth_getBalance method tests', () => {
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
            test(description, async () => {
                const rpcCall = await retryOperation(
                    async () =>
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getBalance
                        ](params)
                );

                // Compare the result with the expected value
                expect(rpcCall).toStrictEqual(expected);
            });
        });

        /**
         * Test cases for eth_getBalance RPC method that throw an error
         */
        invalidEthGetBalanceTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    // Call RPC method
                    await expect(
                        retryOperation(
                            async () =>
                                await RPCMethodsMap(thorClient)[
                                    RPC_METHODS.eth_getBalance
                                ](params)
                        )
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });

    /**
     * eth_getBalance RPC call tests - Negative cases
     */
    describe('eth_getBalance - Negative cases', () => {});
});
