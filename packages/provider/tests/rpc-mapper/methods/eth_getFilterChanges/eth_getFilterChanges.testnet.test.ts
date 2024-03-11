import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getFilterChanges' method
 *
 * @group integration/rpc-mapper/methods/eth_getFilterChanges
 */
describe('RPC Mapper - eth_getFilterChanges method tests', () => {
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
     * eth_getFilterChanges RPC call tests - Positive cases
     */
    describe('eth_getFilterChanges - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getFilterChanges - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getFilterChanges
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getFilterChanges RPC call tests - Negative cases
     */
    describe('eth_getFilterChanges - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getFilterChanges - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getFilterChanges
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
