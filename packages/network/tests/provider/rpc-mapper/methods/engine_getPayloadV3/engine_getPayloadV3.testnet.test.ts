import { beforeEach, describe, expect, test } from '@jest/globals';
import { JSONRPCMethodNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'engine_getPayloadV3' method
 *
 * @group integration/rpc-mapper/methods/engine_getPayloadV3
 */
describe('RPC Mapper - engine_getPayloadV3 method tests', () => {
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
     * engine_getPayloadV3 RPC call tests - Not Implemented
     */
    describe('engine_getPayloadV3 - Not Implemented', () => {
        /**
         * Test that the method throws JSONRPCMethodNotImplemented when called via provider
         */
        test('Should throw JSONRPCMethodNotImplemented error', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.engine_getPayloadV3,
                    params: []
                })
            ).rejects.toThrowError(JSONRPCMethodNotImplemented);
        });
    });
});
