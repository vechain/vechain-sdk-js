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
} from '../eth_getBlockByHash/fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockTransactionCountByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockTransactionCountByHash
 */
describe('RPC Mapper - eth_getBlockTransactionCountByHash method tests', () => {
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
     * eth_getBlockTransactionCountByHash RPC call tests - Positive cases
     */
    describe('eth_getBlockTransactionCountByHash - Positive cases', () => {
        /**
         * eth_getBlockTransactionCountByHash RPC method positive test cases
         */
        ethGetBlockByHashTestCases.forEach(
            ({ description, params, expectedTransactionsLength }) => {
                test(description, async () => {
                    // Call RPC function
                    const rpcCall = await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockTransactionCountByHash
                    ]([params[0]]);

                    // Compare the result with the expected value
                    expect(rpcCall).toStrictEqual(expectedTransactionsLength);
                });
            }
        );
    });

    /**
     * eth_getBlockTransactionCountByHash RPC call tests - Negative cases
     */
    describe('eth_getBlockTransactionCountByHash - Negative cases', () => {
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
                                RPC_METHODS.eth_getBlockTransactionCountByHash
                            ]([params[0]])
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
