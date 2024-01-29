import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'debug_getRawHeader' method
 *
 * @group integration/rpc-mapper/methods/debug_getRawHeader
 */
describe('RPC Mapper - debug_getRawHeader method tests', () => {
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
     * debug_getRawHeader RPC call tests - Positive cases
     */
    describe('debug_getRawHeader - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_getRawHeader - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawHeader
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * debug_getRawHeader RPC call tests - Negative cases
     */
    describe('debug_getRawHeader - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('debug_getRawHeader - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawHeader
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
