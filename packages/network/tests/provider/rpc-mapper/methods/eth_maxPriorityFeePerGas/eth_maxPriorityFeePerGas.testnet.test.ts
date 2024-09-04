import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Mapper integration tests for 'eth_maxPriorityFeePerGas' method
 *
 * @group integration/rpc-mapper/methods/eth_maxPriorityFeePerGas
 */
describe('RPC Mapper - eth_maxPriorityFeePerGas method tests', () => {
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
     * eth_maxPriorityFeePerGas RPC call tests - Positive cases
     */
    describe('eth_maxPriorityFeePerGas - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('eth_maxPriorityFeePerGas - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([-1]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
