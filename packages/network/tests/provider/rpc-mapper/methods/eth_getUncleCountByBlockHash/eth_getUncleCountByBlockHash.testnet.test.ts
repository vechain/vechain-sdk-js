import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_getUncleCountByBlockHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleCountByBlockHash
 */
describe('RPC Mapper - eth_getUncleCountByBlockHash method tests', () => {
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
     * eth_getUncleCountByBlockHash RPC call tests - Positive cases
     */
    describe('eth_getUncleCountByBlockHash - Positive cases', () => {
        /**
         * Should return uncle block count at the given block hash
         */
        test('Should return uncle block count at the given block hash', async () => {
            const uncleBlock = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getUncleCountByBlockHash
            ]([
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450'
            ]);

            expect(uncleBlock).toStrictEqual(0);
        });
    });

    /**
     * eth_getUncleCountByBlockHash RPC call tests - Negative cases
     */
    describe('eth_getUncleCountByBlockHash - Negative cases', () => {
        /**
         * Should NOT be able to return uncle block count at the given block hash
         */
        test('Should NOT be able to return uncle block count at the given block hash', async () => {
            // No params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockHash
                    ]([])
            ).rejects.toThrowError(JSONRPCInvalidParams);

            // Invalid params
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockHash
                    ](['latest', 1])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
