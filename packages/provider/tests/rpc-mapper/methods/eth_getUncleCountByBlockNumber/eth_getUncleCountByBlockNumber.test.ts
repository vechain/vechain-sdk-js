import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

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
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_getUncleCountByBlockNumber RPC call tests - Positive cases
     */
    describe('eth_getUncleCountByBlockNumber - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getUncleCountByBlockNumber - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockNumber
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getUncleCountByBlockNumber RPC call tests - Negative cases
     */
    describe('eth_getUncleCountByBlockNumber - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getUncleCountByBlockNumber - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getUncleCountByBlockNumber
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
