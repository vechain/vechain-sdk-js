import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    ethGetBlockByHashTestCases,
    invalidEthGetBlockByHashTestCases
} from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByHash
 */
describe('RPC Mapper - eth_getBlockByHash method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * eth_getBlockByHash RPC call tests - Positive cases
     */
    describe('eth_getBlockByHash - Positive cases', () => {
        /**
         * Test cases for eth_getBlockByHash RPC method
         */
        ethGetBlockByHashTestCases.forEach(
            ({ description, params, expected }) => {
                test(description, async () => {
                    // Call RPC function
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getBlockByHash
                        ](params);

                    // Compare the result with the expected value
                    expect(rpcCall).toStrictEqual(expected);
                });
            }
        );
    });

    /**
     * eth_getBlockByHash RPC call tests - Negative cases
     */
    describe('eth_getBlockByHash - Negative cases', () => {
        /**
         * Invalid eth_getBlockByHash RPC method test cases
         */
        invalidEthGetBlockByHashTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    // Call RPC function
                    await expect(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getBlockByHash
                            ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
