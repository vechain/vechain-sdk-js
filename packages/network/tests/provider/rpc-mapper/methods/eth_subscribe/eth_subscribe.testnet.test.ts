import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    JSONRPCServerError
} from '@vechain/sdk-errors';

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
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
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
            expect(provider.getPollInstance()).toBeUndefined();
            // Call RPC function
            const rpcCall = (await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            })) as string;

            expect(provider.getPollInstance()).toBeDefined();

            // Verify the length of the subscription ID
            expect(rpcCall.length).toEqual(32);
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
            ).rejects.toThrowError(JSONRPCInvalidParams); // Ideally, specify the expected error for more precise testing.
        });

        /**
         * Tests the behavior of `eth_subscribe` when no provider is available.
         */
        test('eth_subscribe - no provider', async () => {
            // Attempts to unsubscribe with no provider and expects an error.
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_subscribe](
                        []
                    )
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        test('eth_subscribe - no best block', async () => {
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockCompressed'
            ).mockReturnValue(Promise.resolve(null));

            // Attempts to unsubscribe with no provider and expects an error.
            await expect(
                async () =>
                    await provider.request({
                        method: 'eth_subscribe',
                        params: ['newHeads']
                    })
            ).rejects.toThrowError(JSONRPCServerError);
        });
    });
});
