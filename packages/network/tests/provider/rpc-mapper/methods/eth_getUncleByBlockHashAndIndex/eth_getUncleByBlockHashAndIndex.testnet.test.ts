import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Mapper integration tests for 'eth_getUncleByBlockHashAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getUncleByBlockHashAndIndex
 */
describe('RPC Mapper - eth_getUncleByBlockHashAndIndex method tests', () => {
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
     * eth_getUncleByBlockHashAndIndex RPC call tests - Positive cases
     */
    describe('eth_getUncleByBlockHashAndIndex - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_getUncleByBlockHashAndIndex - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getUncleByBlockHashAndIndex
            ]([-1]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
