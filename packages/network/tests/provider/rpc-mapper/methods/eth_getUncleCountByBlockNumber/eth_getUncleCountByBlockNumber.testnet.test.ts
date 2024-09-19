import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getUncleCountByBlockNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleCountByBlockNumber
 */
describe('RPC Mapper - eth_getUncleCountByBlockNumber method tests', () => {
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
     * eth_getUncleCountByBlockNumber RPC call tests - Positive cases
     */
    describe('eth_getUncleCountByBlockNumber - Positive cases', () => {
        /**
         * Should return uncle block count at the given block number
         */
        test('Should return uncle block count at the given block number', async () => {
            const uncleBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getUncleCountByBlockNumber
            ](['latest']);

            expect(uncleBlock).toStrictEqual(0);
        });
    });

    /**
     * eth_getUncleCountByBlockNumber RPC call tests - Negative cases
     */
    describe('eth_getUncleCountByBlockNumber - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block count at the given block number
         */
        test('Should NOT be able to return uncle block count at the given block number', async () => {
            // No params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockNumber
                    ]([])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockNumber
                    ](['latest', 1])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
