import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    ethGetBlockByNumberTestCases,
    invalidEthGetBlockByNumberTestCases
} from './fixture';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByNumber
 */
describe('RPC Mapper - eth_getBlockByNumber method tests', () => {
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
     * eth_getBlockByNumber RPC call tests - Positive cases
     */
    describe('Positive cases', () => {
        /**
         * Test cases for eth_getBlockByNumber RPC method
         */
        ethGetBlockByNumberTestCases.forEach(
            ({ description, params, expected }) => {
                test(description, async () => {
                    // Call RPC function
                    const rpcCall =
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getBlockByNumber
                        ](params);

                    // Compare the result with the expected value
                    expect(rpcCall).toStrictEqual(expected);
                });
            }
        );

        /**
         * Test case where the revision is valid but doesn't refer to an existing block
         */
        test('Should be able to get block with `latest`', async () => {
            // Null block
            const rpcCallNullBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['latest', false]);
            expect(rpcCallNullBlock).toBeDefined();
        });

        /**
         * Test case where the revision is valid but doesn't refer to an existing block
         */
        test('Should be able to get block with `finalized`', async () => {
            // Null block
            const rpcCallNullBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['finalized', false]);
            expect(rpcCallNullBlock).toBeDefined();
        });
    });

    /**
     * eth_getBlockByNumber RPC call tests - Negative cases
     */
    describe('Negative cases', () => {
        /**
         * Invalid eth_getBlockByNumber RPC method test cases
         */
        invalidEthGetBlockByNumberTestCases.forEach(
            ({ description, params, expectedError }) => {
                test(description, async () => {
                    // Call RPC function
                    await expect(
                        async () =>
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getBlockByNumber
                            ](params)
                    ).rejects.toThrowError(expectedError);
                });
            }
        );

        /**
         * Test case where the block number is negative
         */
        test('Should throw `JSONRPCInternalError` for negative block number', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockByNumber
                    ]([`0x${BigInt(-1).toString(16)}`, false]) // Block number is negative (-1)
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
