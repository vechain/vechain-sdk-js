import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    ethGetTransactionByBlockHashAndIndexTestCases,
    invalidEthGetTransactionByBlockHashAndIndexTestCases
} from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getTransactionByBlockHashAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByBlockHashAndIndex
 */
describe('RPC Mapper - eth_getTransactionByBlockHashAndIndex method tests', () => {
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
     * eth_getTransactionByBlockHashAndIndex RPC call tests - Positive cases
     */
    describe('eth_getTransactionByBlockHashAndIndex - Positive cases', () => {
        /**
         * Test cases where the rpc method call does not throw an error
         */
        ethGetTransactionByBlockHashAndIndexTestCases.forEach(
            ({ description, params, expected }) => {
                test(description, async () => {
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionByBlockHashAndIndex
                        ](params);
                    expect(rpcCall).toStrictEqual(expected);
                });
            }
        );
    });

    /**
     * eth_getTransactionByBlockHashAndIndex RPC call tests - Negative cases
     */
    describe('eth_getTransactionByBlockHashAndIndex - Negative cases', () => {
        /**
         * Test cases where the rpc method call throws an error
         */
        invalidEthGetTransactionByBlockHashAndIndexTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    await expect(
                        RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionByBlockHashAndIndex
                        ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
