import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockTransactionCountByHash' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockTransactionCountByHash
 */
describe('RPC Mapper - eth_getBlockTransactionCountByHash method tests', () => {
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
     * eth_getBlockTransactionCountByHash RPC call tests - Positive cases
     */
    describe('eth_getBlockTransactionCountByHash - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getBlockTransactionCountByHash - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockTransactionCountByHash
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getBlockTransactionCountByHash RPC call tests - Negative cases
     */
    describe('eth_getBlockTransactionCountByHash - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getBlockTransactionCountByHash - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockTransactionCountByHash
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
