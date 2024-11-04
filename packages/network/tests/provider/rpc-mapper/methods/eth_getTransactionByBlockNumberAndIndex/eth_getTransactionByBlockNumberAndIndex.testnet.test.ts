import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    ethGetTransactionByBlockNumberAndIndexTestCases,
    invalidEthGetTransactionByBlockNumberAndIndexTestCases
} from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getTransactionByBlockNumberAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByBlockNumberAndIndex
 */
describe('RPC Mapper - eth_getTransactionByBlockNumberAndIndex method tests', () => {
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
     * eth_getTransactionByBlockNumberAndIndex RPC call tests - Positive cases
     */
    describe('eth_getTransactionByBlockNumberAndIndex - Positive cases', () => {
        /**
         * Test cases where the rpc method call does not throw an error
         */
        ethGetTransactionByBlockNumberAndIndexTestCases.forEach(
            ({ description, params, expected }) => {
                test(description, async () => {
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionByBlockNumberAndIndex
                        ](params);
                    expect(rpcCall).toStrictEqual(expected);
                });
            }
        );
    });

    /**
     * eth_getTransactionByBlockNumberAndIndex RPC call tests - Negative cases
     */
    describe('eth_getTransactionByBlockNumberAndIndex - Negative cases', () => {
        /**
         * Test cases where the rpc method call throws an error
         */
        invalidEthGetTransactionByBlockNumberAndIndexTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    await expect(
                        RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionByBlockNumberAndIndex
                        ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
