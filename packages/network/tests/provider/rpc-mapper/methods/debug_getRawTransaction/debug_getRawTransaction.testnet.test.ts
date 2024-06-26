import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { testnetUrl } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'debug_getRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/debug_getRawTransaction
 */
describe('RPC Mapper - debug_getRawTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * debug_getRawTransaction RPC call tests - Positive cases
     */
    describe('debug_getRawTransaction - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_getRawTransaction - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawTransaction
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * debug_getRawTransaction RPC call tests - Negative cases
     */
    describe('debug_getRawTransaction - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('debug_getRawTransaction - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawTransaction
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
