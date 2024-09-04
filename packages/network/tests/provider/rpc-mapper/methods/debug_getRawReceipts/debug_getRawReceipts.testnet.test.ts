import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

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
        test('debug_getBadBlocks - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[RPC_METHODS.debug_getRawReceipts]([
                -1
            ]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
