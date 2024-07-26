import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

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
         * Positive case 1 - ... Description ...
         */
        test('eth_getUncleByBlockHashAndIndex - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockHashAndIndex
                    ]([-1])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * eth_getUncleByBlockHashAndIndex RPC call tests - Negative cases
     */
    describe('eth_getUncleByBlockHashAndIndex - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getUncleByBlockHashAndIndex - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleByBlockHashAndIndex
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
