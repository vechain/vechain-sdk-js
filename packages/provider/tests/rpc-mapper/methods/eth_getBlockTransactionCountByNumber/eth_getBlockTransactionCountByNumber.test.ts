import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockTransactionCountByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockTransactionCountByNumber
 */
describe('RPC Mapper - eth_getBlockTransactionCountByNumber method tests', () => {
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
     * eth_getBlockTransactionCountByNumber RPC call tests - Positive cases
     */
    describe('eth_getBlockTransactionCountByNumber - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getBlockTransactionCountByNumber - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockTransactionCountByNumber
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * eth_getBlockTransactionCountByNumber RPC call tests - Negative cases
     */
    describe('eth_getBlockTransactionCountByNumber - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_getBlockTransactionCountByNumber - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_getBlockTransactionCountByNumber
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
