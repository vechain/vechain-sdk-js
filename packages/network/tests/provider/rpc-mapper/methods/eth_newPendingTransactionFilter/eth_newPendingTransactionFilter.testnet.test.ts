import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Mapper integration tests for 'eth_newPendingTransactionFilter' method
 *
 * @group integration/rpc-mapper/methods/eth_newPendingTransactionFilter
 */
describe('RPC Mapper - eth_newPendingTransactionFilter method tests', () => {
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
     * eth_newPendingTransactionFilter RPC call tests - Positive cases
     */
    describe('eth_newPendingTransactionFilter - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_newPendingTransactionFilter - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_newPendingTransactionFilter
            ]([-1]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
