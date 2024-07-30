import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_getWork' method
 *
 * @group integration/rpc-mapper/methods/eth_getWork
 */
describe('RPC Mapper - eth_getWork method tests', () => {
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
     * eth_getWork RPC call tests - Positive cases
     */
    describe('eth_getWork - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getWork - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getWork]([
                        -1
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * eth_getWork RPC call tests - Negative cases
     */
    describe('eth_getWork - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getWork - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_getWork]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
