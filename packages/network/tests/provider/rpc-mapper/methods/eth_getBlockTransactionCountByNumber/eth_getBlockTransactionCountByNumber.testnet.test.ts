import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { ethGetBlockByHashTestCases } from '../eth_getBlockByHash/fixture';
import { invalideEthGetBlockTransactionCountByHashTestCases } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockTransactionCountByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockTransactionCountByNumber
 */
describe('RPC Mapper - eth_getBlockTransactionCountByNumber method tests', () => {
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
     * eth_getBlockTransactionCountByNumber RPC call tests - Positive cases
     */
    describe('eth_getBlockTransactionCountByNumber - Positive cases', () => {
        /**
         * eth_getBlockTransactionCountByNumber RPC method positive test cases
         */
        ethGetBlockByHashTestCases.forEach(
            ({ description, params, expectedTransactionsLength }) => {
                test(description, async () => {
                    // Call RPC function
                    const rpcCall = await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockTransactionCountByNumber
                    ]([params[0]]);

                    // Compare the result with the expected value
                    expect(rpcCall).toStrictEqual(expectedTransactionsLength);
                });
            }
        );
    });

    /**
     * eth_getBlockTransactionCountByNumber RPC call tests - Negative cases
     */
    describe('eth_getBlockTransactionCountByNumber - Negative cases', () => {
        /**
         * Invalid eth_getBlockTransactionCountByNumber RPC method test cases
         */
        invalideEthGetBlockTransactionCountByHashTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    // Call RPC function
                    await expect(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getBlockTransactionCountByNumber
                            ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
