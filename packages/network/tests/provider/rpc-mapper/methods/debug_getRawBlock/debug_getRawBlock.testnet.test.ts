import { beforeEach, describe, expect, test } from '@jest/globals';
import { NotImplementedError } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'debug_getRawBlock' method
 *
 * @group integration/rpc-mapper/methods/debug_getRawBlock
 */
describe('RPC Mapper - debug_getRawBlock method tests', () => {
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
     * debug_getRawBlock RPC call tests - Positive cases
     */
    describe('debug_getRawBlock - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_getRawBlock - positive case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawBlock
                    ]([-1])
            ).rejects.toThrowError(NotImplementedError);
        });
    });

    /**
     * debug_getRawBlock RPC call tests - Negative cases
     */
    describe('debug_getRawBlock - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('debug_getRawBlock - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.debug_getRawBlock
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(NotImplementedError);
        });
    });
});
