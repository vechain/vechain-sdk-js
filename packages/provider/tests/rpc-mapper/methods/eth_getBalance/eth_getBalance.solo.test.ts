import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../../../fixture';
import {
    ethGetBalanceTestCases,
    invalidEthGetBalanceTestCases
} from './fixture';

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
        thorClient = new ThorClient(soloNetwork);
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
                const rpcCall =
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getBalance](
                        params
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
                        RPCMethodsMap(thorClient)[RPC_METHODS.eth_getBalance](
                            params
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
