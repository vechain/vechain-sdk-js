import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_coinbase' method
 *
 * @group integration/rpc-mapper/methods/eth_coinbase
 */
describe('RPC Mapper - eth_coinbase method tests', () => {
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
     * eth_coinbase RPC call tests - Positive cases
     */
    describe('eth_coinbase - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_coinbase - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_coinbase]([
                        -1
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_coinbase RPC call tests - Negative cases
     */
    describe('eth_coinbase - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_coinbase - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_coinbase]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
