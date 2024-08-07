import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

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
        thorClient = ThorClient.fromUrl(TESTNET_URL);
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
            ).rejects.toThrowError(FunctionNotImplemented);
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
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
