import { beforeEach, describe, expect, test } from '@jest/globals';
import { JSONRPCMethodNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_protocolVersion' method
 *
 * @group integration/rpc-mapper/methods/eth_protocolVersion
 */
describe('RPC Mapper - eth_protocolVersion method tests', () => {
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
     * eth_protocolVersion RPC call tests - Not Implemented
     */
    describe('eth_protocolVersion - Not Implemented', () => {
        /**
         * Test that the method throws JSONRPCMethodNotImplemented when called via provider
         */
        test('Should throw JSONRPCMethodNotImplemented error', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_protocolVersion,
                    params: []
                })
            ).rejects.toThrowError(JSONRPCMethodNotImplemented);
        });
    });
});
