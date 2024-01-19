import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'debug_getBadBlocks' method
 *
 * @group integration/rpc-mapper/methods/debug_getBadBlocks
 */
describe('RPC Mapper - debug_getBadBlocks method tests', () => {
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
     * debug_getBadBlocks RPC call tests - Positive cases
     */
    describe('debug_getBadBlocks - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_getBadBlocks - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getBadBlocks
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * debug_getBadBlocks RPC call tests - Negative cases
     */
    describe('debug_getBadBlocks - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('debug_getBadBlocks - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getBadBlocks
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
