import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getUncleByBlockNumberAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleByBlockNumberAndIndex
 */
describe('RPC Mapper - eth_getUncleByBlockNumberAndIndex method tests', () => {
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
     * eth_getUncleByBlockNumberAndIndex RPC call tests - Positive cases
     */
    describe('eth_getUncleByBlockNumberAndIndex - Positive cases', () => {
        /**
         * Should return uncle block at the given block number and index
         */
        test('Should return uncle block at the given block number and index', async () => {
            const uncleBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getUncleByBlockNumberAndIndex
            ](['latest', '0x0']);

            expect(uncleBlock).toStrictEqual(null);
        });
    });

    /**
     * eth_getUncleByBlockNumberAndIndex RPC call tests - Negative cases
     */
    describe('eth_getUncleByBlockNumberAndIndex - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block at the given block number and index with invalid params
         */
        test('Should NOT be able to return uncle block at the given block number and index with invalid params', async () => {
            // No params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockNumberAndIndex
                    ]([])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Only 1 param
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockNumberAndIndex
                    ](['latest'])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockNumberAndIndex
                    ](['latest', 1])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
