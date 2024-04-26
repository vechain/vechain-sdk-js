import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { mainNetwork } from '../../../../fixture';
import {
    ethGetStorageAtTestCases,
    invalidEthGetStorageAtTestCases
} from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getStorageAt' method
 *
 * @group integration/rpc-mapper/methods/eth_getStorageAt
 */
describe('RPC Mapper - eth_getStorageAt method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(mainNetwork);
    });

    /**
     * eth_getStorageAt RPC call tests - Positive cases
     */
    describe('eth_getStorageAt - Positive cases', () => {
        /**
         * Test cases for eth_getStorageAt RPC method that do not throw an error
         */
        ethGetStorageAtTestCases.forEach(
            ({ description, params, expected }) => {
                test(description, async () => {
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getStorageAt
                        ](params);

                    // Compare the result with the expected value
                    expect(rpcCall).toBe(expected);
                });
            }
        );
    });

    /**
     * eth_getStorageAt RPC call tests - Negative cases
     */
    describe('eth_getStorageAt - Negative cases', () => {
        /**
         * Test cases for eth_getStorageAt RPC method that throw an error
         */
        invalidEthGetStorageAtTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    // Call RPC method
                    const rpcCall =
                        RPCMethodsMap(thorClient)[RPC_METHODS.eth_getStorageAt](
                            params
                        );

                    // Compare the result with the expected value
                    await expect(rpcCall).rejects.toThrow(expectedError);
                });
            }
        );
    });
});
