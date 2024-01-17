import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_subscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_subscribe
 */
describe('RPC Mapper - eth_subscribe method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Inti thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destory thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_subscribe RPC call tests - Positive cases
     */
    describe('eth_subscribe - Positive cases', () => {
        /**
         * Positive case 1 - Get subscription ID
         */
        test('eth_subscribe - positive case 1', async () => {
            const subscriptionId = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_subscribe
            ](['newHeads']);
            expect(subscriptionId).toBeDefined();
        });
    });

    /**
     * eth_subscribe RPC call tests - Negative cases
     */
    describe('eth_subscribe - Negative cases', () => {
        /**
         * Negative case 1 - No params
         */
        test('eth_subscribe - No params', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_subscribe](
                        []
                    )
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });
});
