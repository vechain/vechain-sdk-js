"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper integration tests for 'eth_subscribe' method
 *
 * @group integration/rpc-mapper/methods/eth_subscribe
 */
(0, globals_1.describe)('RPC Mapper - eth_subscribe method tests', () => {
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
    /**
     * Describes the test suite for positive test cases of the `eth_subscribe` RPC method.
     * This suite includes various scenarios where `eth_subscribe` is expected to succeed,
     * verifying the correct behavior of subscription functionalities for different types
     * of events in Ethereum, such as `newHeads`.
     */
    (0, globals_1.describe)('eth_subscribe - Positive cases', () => {
        /**
         * Tests successful subscription to the 'newHeads' event.
         * It verifies that the RPC call to `eth_subscribe` with 'newHeads' as a parameter
         * successfully returns a subscription ID, and that the ID has the expected length
         * of 32 characters, indicating a valid response format.
         */
        (0, globals_1.test)('eth_subscribe - new latest blocks subscription', async () => {
            (0, globals_1.expect)(provider.getPollInstance()).toBeUndefined();
            // Call RPC function
            const rpcCall = (await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            }));
            (0, globals_1.expect)(provider.getPollInstance()).toBeDefined();
            // Verify the length of the subscription ID
            (0, globals_1.expect)(rpcCall.length).toEqual(32);
        });
    });
    /**
     * Describes the test suite for negative test cases of the `eth_subscribe` RPC method.
     * This suite focuses on scenarios where `eth_subscribe` is expected to fail, such as
     * when invalid parameters are provided. The aim is to ensure the method handles errors
     * gracefully and in accordance with the JSON-RPC specifications.
     */
    (0, globals_1.describe)('eth_subscribe - Negative cases', () => {
        /**
         * Tests the behavior of `eth_subscribe` when an invalid subscription type is provided.
         * The test expects the RPC call to throw an error, demonstrating that the method
         * properly validates input parameters and handles invalid requests as per the
         * JSON-RPC error handling conventions.
         */
        (0, globals_1.test)('eth_subscribe - invalid subscription', async () => {
            await (0, globals_1.expect)(async () => await provider.request({
                method: 'eth_subscribe',
                params: ['invalidSubscriptionType']
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams); // Ideally, specify the expected error for more precise testing.
        });
        /**
         * Tests the behavior of `eth_subscribe` when no provider is available.
         */
        (0, globals_1.test)('eth_subscribe - no provider', async () => {
            // Attempts to unsubscribe with no provider and expects an error.
            await (0, globals_1.expect)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_subscribe]([])).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        (0, globals_1.test)('eth_subscribe - no best block', async () => {
            globals_1.jest.spyOn(thorClient.blocks, 'getBestBlockCompressed').mockReturnValue(Promise.resolve(null));
            // Attempts to unsubscribe with no provider and expects an error.
            await (0, globals_1.expect)(async () => await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            })).rejects.toThrowError(sdk_errors_1.JSONRPCServerError);
        });
    });
});
