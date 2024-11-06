import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    ethGetTransactionByHashTestCases,
    invalidEthGetTransactionByHashTestCases
} from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getTransactionByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByHash
 */
describe('RPC Mapper - eth_getTransactionByHash method tests', () => {
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
     * eth_getTransactionByHash RPC call tests - Positive cases
     */
    describe('eth_getTransactionByHash - Positive cases', () => {
        /**
         * Test cases where the rpc method call does not throw an error
         */
        ethGetTransactionByHashTestCases.forEach(
            ({ description, params, expected }) => {
                test(description, async () => {
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionByHash
                        ](params);
                    expect(rpcCall).toStrictEqual(expected);
                });
            }
        );
    });

    /**
     * eth_getTransactionByHash RPC call tests - Negative cases
     */
    describe('eth_getTransactionByHash - Negative cases', () => {
        /**
         * Test cases where the rpc method call throws an error
         */
        invalidEthGetTransactionByHashTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    await expect(
                        RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionByHash
                        ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
