import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import { RPC_METHODS, RPCMethodsMap, ThorClient } from '../../../../../src';
import { TESTNET_URL } from '@vechain/sdk-constant';

/**
 * RPC Mapper integration tests for 'debug_getRawReceipts' method
 *
 * @group integration/rpc-mapper/methods/debug_getRawReceipts
 */
describe('RPC Mapper - debug_getRawReceipts method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * debug_getRawReceipts RPC call tests - Positive cases
     */
    describe('debug_getRawReceipts - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_getRawReceipts - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawReceipts
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * debug_getRawReceipts RPC call tests - Negative cases
     */
    describe('debug_getRawReceipts - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('debug_getRawReceipts - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawReceipts
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
