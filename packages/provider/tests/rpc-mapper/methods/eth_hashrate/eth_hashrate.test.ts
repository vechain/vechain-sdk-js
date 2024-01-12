import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_hashrate' method
 *
 * @group integration/rpc-mapper/methods/eth_hashrate
 */
describe('RPC Mapper - eth_hashrate method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Inti thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destory thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_hashrate RPC call tests - Positive cases
     */
    describe('eth_hashrate - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_hashrate - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_hashrate]([
                        -1
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_hashrate RPC call tests - Negative cases
     */
    describe('eth_hashrate - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_hashrate - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_hashrate]([
                        'SOME_RANDOM_PARAM'
                    ])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
