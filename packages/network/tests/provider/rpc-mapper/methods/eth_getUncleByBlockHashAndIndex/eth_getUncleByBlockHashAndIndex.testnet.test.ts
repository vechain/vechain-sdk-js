import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getUncleByBlockHashAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleByBlockHashAndIndex
 */
describe('RPC Mapper - eth_getUncleByBlockHashAndIndex method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * eth_getUncleByBlockHashAndIndex RPC call tests - Positive cases
     */
    describe('eth_getUncleByBlockHashAndIndex - Positive cases', () => {
        /**
         * Should return uncle block at the given block hash and index
         */
        test('Should return uncle block at the given block hash and index', async () => {
            const uncleBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getUncleByBlockHashAndIndex
            ]([
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
                '0x0'
            ]);

            expect(uncleBlock).toStrictEqual({});
        });
    });

    /**
     * eth_getUncleByBlockHashAndIndex RPC call tests - Negative cases
     */
    describe('eth_getUncleByBlockHashAndIndex - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block at the given block hash and index with invalid params
         */
        test('Should NOT be able to return uncle block at the given block hash and index with invalid params', async () => {
            // No params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockHashAndIndex
                    ]([])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Only 1 param
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockHashAndIndex
                    ](['latest'])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockHashAndIndex
                    ](['latest', 1])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
