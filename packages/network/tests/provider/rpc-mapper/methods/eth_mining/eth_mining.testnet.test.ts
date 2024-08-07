import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_mining' method
 *
 * @group integration/rpc-mapper/methods/eth_mining
 */
describe('RPC Mapper - eth_mining method tests', () => {
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
     * eth_mining RPC call tests - Positive cases
     */
    describe('eth_mining - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_mining - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_mining]([
                        -1
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * eth_mining RPC call tests - Negative cases
     */
    describe('eth_mining - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_mining - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_mining]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
