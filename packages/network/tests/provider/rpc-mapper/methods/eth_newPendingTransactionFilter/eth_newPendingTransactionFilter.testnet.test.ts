import { beforeEach, describe, expect, test } from '@jest/globals';
import { JSONRPCMethodNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_newPendingTransactionFilter' method
 *
 * @group integration/rpc-mapper/methods/eth_newPendingTransactionFilter
 */
describe('RPC Mapper - eth_newPendingTransactionFilter method tests', () => {
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
     * eth_newPendingTransactionFilter RPC call tests - Not Implemented
     */
    describe('eth_newPendingTransactionFilter - Not Implemented', () => {
        /**
         * Test that the method throws JSONRPCMethodNotImplemented when called via provider
         */
        test('Should throw JSONRPCMethodNotImplemented error', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_newPendingTransactionFilter,
                    params: []
                })
            ).rejects.toThrowError(JSONRPCMethodNotImplemented);
        });
    });
});
