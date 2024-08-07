import { beforeEach, describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented } from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

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
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_maxPriorityFeePerGas
                    ]([-1])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });

    /**
     * eth_maxPriorityFeePerGas RPC call tests - Negative cases
     */
    describe('eth_maxPriorityFeePerGas - Negative cases', () => {
        /**
         * Negative case 1 - ... Description ...
         */
        test('eth_maxPriorityFeePerGas - negative case 1', async () => {
            // NOT IMPLEMENTED YET!
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[
                        RPC_METHODS.eth_maxPriorityFeePerGas
                    ](['SOME_RANDOM_PARAM'])
            ).rejects.toThrowError(FunctionNotImplemented);
        });
    });
});
