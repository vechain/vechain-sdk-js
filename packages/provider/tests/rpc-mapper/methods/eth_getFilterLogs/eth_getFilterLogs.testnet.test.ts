import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getFilterLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getFilterLogs
 */
describe('RPC Mapper - eth_getFilterLogs method tests', () => {
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
     * eth_getFilterLogs RPC call tests - Positive cases
     */
    describe('eth_getFilterLogs - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getFilterLogs - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getFilterLogs
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getFilterLogs RPC call tests - Negative cases
     */
    describe('eth_getFilterLogs - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getFilterLogs - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getFilterLogs
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
