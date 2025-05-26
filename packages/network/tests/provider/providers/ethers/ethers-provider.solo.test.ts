import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    HardhatVeChainProvider,
    JSONRPCEthersProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL
} from '../../../../src';

import { SOLO_NETWORK } from '@vechain/sdk-core';
import { providerMethodsTestCasesSolo } from '../fixture';
import { VeChainProvider } from '../../../../src/provider/providers/vechain-provider';
import { ThorClient } from '../../../../src/thor-client';

/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
describe('VeChain provider tests - solo', () => {
    // Add retry configuration for all tests in this suite
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

    // Increase timeout for provider tests
    const TIMEOUT = 30000; // 30 seconds

    let hardhatVeChainProvider: HardhatVeChainProvider;
    let jsonRPCEthersProvider: JSONRPCEthersProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        hardhatVeChainProvider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent),
            false
        );
        jsonRPCEthersProvider = new JSONRPCEthersProvider(
            SOLO_NETWORK.chainTag,
            THOR_SOLO_URL,
            hardhatVeChainProvider
        );
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        hardhatVeChainProvider.destroy();
        jsonRPCEthersProvider.destroy();
    });

    /**
     * eth_getBalance RPC call test
     */
    test('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await jsonRPCEthersProvider.send('eth_blockNumber', []);

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    });

    /**
     * Provider methods tests
     */
    providerMethodsTestCasesSolo.forEach(
        ({ description, method, params, expected }) => {
            test(description, async () => {
                // Call RPC function
                const rpcCall = await jsonRPCEthersProvider.send(
                    method,
                    params
                );

                // Compare the result with the expected value
                expect(rpcCall).toStrictEqual(expected);
            });
        }
    );

    /**
     * eth_subscribe latest blocks RPC call test
     */
    test(
        'Should be able to get to subscribe to the latest blocks',
        async () => {
            const thorClient = ThorClient.at(THOR_SOLO_URL);
            const provider = new VeChainProvider(thorClient);
            // Start polling for subscriptions
            provider.startSubscriptionsPolling();
            // Subscribe to new blocks
            const subscriptionId = await provider.request({
                method: 'eth_subscribe',
                params: ['newHeads']
            });
            expect(subscriptionId).toBeDefined();
            expect(typeof subscriptionId).toBe('string');
            // Clean up
            provider.destroy();
        },
        TIMEOUT
    );

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(jsonRPCEthersProvider).toBeDefined();

        // Call RPC function
        await expect(
            async () => await jsonRPCEthersProvider.send('INVALID_METHOD', [-1])
        ).rejects.toThrowError();
    });
});
