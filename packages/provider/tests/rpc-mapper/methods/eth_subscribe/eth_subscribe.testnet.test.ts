import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { RPC_METHODS, RPCMethodsMap, VechainProvider } from '../../../../src';
import { JSONRPCInternalError } from '@vechain/vechain-sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_subscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_subscribe
 */
describe('RPC Mapper - eth_subscribe method tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
        provider = new VechainProvider(thorClient);
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * Describes the test suite for positive test cases of the `eth_subscribe` RPC method.
     * This suite includes various scenarios where `eth_subscribe` is expected to succeed,
     * verifying the correct behavior of subscription functionalities for different types
     * of events in Ethereum, such as `newHeads`.
     */
    describe('eth_subscribe - Positive cases', () => {
        /**
         * Tests successful subscription to the 'newHeads' event.
         * It verifies that the RPC call to `eth_subscribe` with 'newHeads' as a parameter
         * successfully returns a subscription ID, and that the ID has the expected length
         * of 32 characters, indicating a valid response format.
         */
        test('eth_subscribe - new latest blocks subscription', async () => {
            // Call RPC function
            const rpcCall = (await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            })) as string;

            // Verify the length of the subscription ID
            expect(rpcCall.length).toEqual(32);
        });

        test('eth_subscribe - no provider', async () => {
            // Attempts to unsubscribe with no provider and expects an error.
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_subscribe](
                        []
                    )
            ).rejects.toThrowError(JSONRPCInternalError);
        });
    });

    /**
     * Describes the test suite for negative test cases of the `eth_subscribe` RPC method.
     * This suite focuses on scenarios where `eth_subscribe` is expected to fail, such as
     * when invalid parameters are provided. The aim is to ensure the method handles errors
     * gracefully and in accordance with the JSON-RPC specifications.
     */
    describe('eth_subscribe - Negative cases', () => {
        /**
         * Tests the behavior of `eth_subscribe` when an invalid subscription type is provided.
         * The test expects the RPC call to throw an error, demonstrating that the method
         * properly validates input parameters and handles invalid requests as per the
         * JSON-RPC error handling conventions.
         */
        test('eth_subscribe - invalid subscription', async () => {
            await expect(
                async () =>
                    await provider.request({
                        method: 'eth_subscribe',
                        params: ['invalidSubscriptionType']
                    })
            ).rejects.toThrowError(); // Ideally, specify the expected error for more precise testing.
        });
    });
});
