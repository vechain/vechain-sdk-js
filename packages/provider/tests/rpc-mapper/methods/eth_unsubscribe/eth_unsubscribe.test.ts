import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { VechainProvider } from '../../../../src';

/**
 * RPC Mapper integration tests for 'eth_unsubscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_unsubscribe
 */
describe('RPC Mapper - eth_unsubscribe method tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Inti thor client and provider before each test
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

    // Describes the test suite for positive cases of the `eth_unsubscribe` RPC method.
    describe('eth_unsubscribe - Positive cases', () => {
        /**
         * Tests the successful unsubscription from 'newHeads' events.
         * It first subscribes to 'newHeads' events using 'eth_subscribe', and then
         * attempts to unsubscribe using 'eth_unsubscribe'. The test verifies that
         * the unsubscription is successful and the result is as expected.
         */
        test('eth_unsubscribe - positive case 1', async () => {
            // Subscribes to 'newHeads' events.
            const ethSubscribeResult = (await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            })) as string;

            // Checks if the subscription result is defined.
            expect(ethSubscribeResult).toBeDefined();

            // Verifies the 'newHeads' subscription is present in the subscription manager.
            expect(
                provider.subscriptionManager.newHeadsSubscription
            ).toBeDefined();

            // Unsubscribes from 'newHeads' events.
            const ethUnsubscribeResult = (await provider.request({
                method: 'eth_unsubscribe',
                params: [ethSubscribeResult] // Should unsubscribe using the subscription ID returned by 'eth_subscribe', not 'newHeads'.
            })) as boolean;

            // Asserts the unsubscription result is true, indicating success.
            expect(ethUnsubscribeResult).toEqual(true);
        });
    });

    // Describes the test suite for negative cases of the `eth_unsubscribe` RPC method.
    describe('eth_unsubscribe - Negative cases', () => {
        /**
         * Tests the behavior of 'eth_unsubscribe' with invalid parameters.
         * The test attempts to unsubscribe using an invalid subscription ID and expects
         * an error to be thrown, specifically a JSONRPCInternalError, indicating the
         * failure of the operation due to invalid parameters.
         */
        test('eth_unsubscribe - negative case 1', async () => {
            // Attempts to unsubscribe with an invalid subscription ID and expects an error.
            expect(
                await provider.request({
                    method: 'eth_unsubscribe',
                    params: ['invalid_subscription_id']
                })
            ).toBe(false); // Assumes JSONRPCInternalError is defined and imported.
        });
    });
});
