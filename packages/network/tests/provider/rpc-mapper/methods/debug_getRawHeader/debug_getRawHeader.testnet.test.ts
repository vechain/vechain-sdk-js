import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

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
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * debug_getRawHeader RPC call tests - Positive cases
     */
    describe('debug_getRawHeader - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('debug_getRawHeader - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[RPC_METHODS.debug_getRawHeader]([
                -1
            ]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
