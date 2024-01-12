import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_submitWork' method
 *
 * @group integration/rpc-mapper/methods/eth_submitWork
 */
describe('RPC Mapper - eth_submitWork method tests', () => {
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
     * eth_submitWork RPC call tests - Positive cases
     */
    describe('eth_submitWork - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_submitWork - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_submitWork](
                        [-1]
                    )
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_submitWork RPC call tests - Negative cases
     */
    describe('eth_submitWork - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_submitWork - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_submitWork](
                        ['SOME_RANDOM_PARAM']
                    )
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
