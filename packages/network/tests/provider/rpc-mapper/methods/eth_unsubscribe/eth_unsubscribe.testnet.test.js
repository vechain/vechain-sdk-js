"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_unsubscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_unsubscribe
 */
(0, globals_1.describe)('RPC Mapper - eth_unsubscribe method tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    // Describes the test suite for positive cases of the `eth_unsubscribe` RPC method.
    (0, globals_1.describe)('eth_unsubscribe - Positive cases', () => {
        /**
         * Tests the successful unsubscription from 'newHeads' events.
         * It first subscribes to 'newHeads' events using 'eth_subscribe', and then
         * attempts to unsubscribe using 'eth_unsubscribe'. The test verifies that
         * the unsubscription is successful and the result is as expected.
         */
        (0, globals_1.test)('eth_unsubscribe - positive case 1', async () => {
            // Subscribes to 'newHeads' events.
            const ethSubscribeResult = (await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            }));
            // Checks if the subscription result is defined.
            (0, globals_1.expect)(ethSubscribeResult).toBeDefined();
            // Verifies the 'newHeads' subscription is present in the subscription manager.
            (0, globals_1.expect)(provider.subscriptionManager.newHeadsSubscription).toBeDefined();
            // Unsubscribes from 'newHeads' events.
            const ethUnsubscribeResult = (await provider.request({
                method: 'eth_unsubscribe',
                params: [ethSubscribeResult] // Should unsubscribe using the subscription ID returned by 'eth_subscribe', not 'newHeads'.
            }));
            // Asserts the unsubscription result is true, indicating success.
            (0, globals_1.expect)(ethUnsubscribeResult).toEqual(true);
        });
    });
    // Describes the test suite for negative cases of the `eth_unsubscribe` RPC method.
    (0, globals_1.describe)('eth_unsubscribe - Negative cases', () => {
        /**
         * Tests the behavior of 'eth_unsubscribe' with invalid parameters.
         * The test attempts to unsubscribe using an invalid subscription ID and expects
         * an error to be thrown, specifically a JSONRPCInternalError, indicating the
         * failure of the operation due to invalid parameters.
         */
        (0, globals_1.test)('eth_unsubscribe - invalid subscription id', async () => {
            // Attempts to unsubscribe with an invalid subscription ID and expects an error.
            (0, globals_1.expect)(await provider.request({
                method: 'eth_unsubscribe',
                params: ['invalid_subscription_id']
            })).toBe(false);
            (0, globals_1.expect)(provider.getPollInstance()).toBeUndefined();
        });
        (0, globals_1.test)('eth_unsubscribe - no provider', async () => {
            // Attempts to unsubscribe with no provider and expects an error.
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_unsubscribe]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
