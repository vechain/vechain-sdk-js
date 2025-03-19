import { beforeEach, describe, expect, test } from '@jest/globals';
import { JSONRPCMethodNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'debug_getRawReceipts' method
 *
 * @group integration/rpc-mapper/methods/debug_getRawReceipts
 */
describe('RPC Mapper - debug_getRawReceipts method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
    });

    /**
     * debug_getRawReceipts RPC call tests - Not Implemented
     */
    describe('debug_getRawReceipts - Not Implemented', () => {
        /**
         * Test that the method throws JSONRPCMethodNotImplemented when called via provider
         */
        test('Should throw JSONRPCMethodNotImplemented error', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.debug_getRawReceipts,
                    params: []
                })
            ).rejects.toThrowError(JSONRPCMethodNotImplemented);
        });
    });
});
