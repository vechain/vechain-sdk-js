import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { soloNetwork } from '../../../fixture';
import { ethGetCodeTestCases, invalidEthGetCodeTestCases } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getCode' method - Solo Network
 *
 * @group integration/rpc-mapper/methods/eth_getCode
 */
describe('RPC Mapper - eth_getCode method tests', () => {
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
     * eth_getCode RPC call tests - Positive cases
     */
    describe('eth_getCode - Positive cases', () => {
        /**
         * Test cases for eth_getCode RPC method that do not throw an error
         */
        ethGetCodeTestCases.forEach(({ description, params, expected }) => {
            test(`${description}`, async () => {
                const rpcCall =
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getCode](
                        params
                    );

                // Compare the result with the expected value
                expect(rpcCall).toBe(expected);
            });
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
