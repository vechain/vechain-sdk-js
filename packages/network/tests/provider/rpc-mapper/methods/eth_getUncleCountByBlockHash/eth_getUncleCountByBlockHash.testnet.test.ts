import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

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
         * Positive case 1 - ... Description ...
         */
        test('eth_getUncleCountByBlockHash - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockHash
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getUncleCountByBlockHash RPC call tests - Negative cases
     */
    describe('eth_getUncleCountByBlockHash - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getUncleCountByBlockHash - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockHash
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
