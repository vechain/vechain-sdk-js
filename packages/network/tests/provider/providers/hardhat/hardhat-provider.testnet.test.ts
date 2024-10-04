import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { providerMethodsTestCasesTestnet } from '../fixture';
import { waitForMessage } from '../helpers';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    TESTNET_URL,
    type VeChainProvider
} from '../../../../src';

/**
 *VeChain provider tests
 *
 * @group integration/providers/vechain-provider-testnet
 */
describe('Hardhat provider tests - testnet', () => {
    /**
     * Hardhat provider instances
     */
    let provider: HardhatVeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            TESTNET_URL,
            (message: string, parent?: Error) => new Error(message, parent)
        );
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * Provider methods tests
     */
    providerMethodsTestCasesTestnet.forEach(
        ({ description, method, params, expected }) => {
            test(description, async () => {
                // Call RPC function
                const rpcCall = await provider.request({
                    method,
                    params
                });

                // Compare the result with the expected value
                expect(rpcCall).toStrictEqual(expected);
            });
        }
    );

    /**
     * eth_blockNumber RPC call test
     */
    test('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_blockNumber',
            params: []
        });

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    });

    /**
     * eth_subscribe latest blocks RPC call test
     */
    test('Should be able to get to subscribe to the latest blocks', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        const messageReceived = waitForMessage(provider as VeChainProvider);

        const message = await messageReceived;

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message.method).toBe('eth_subscription');
        expect(message.params.subscription).toBeDefined();

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    }, 12000);

    /**
     * eth_getBalance RPC call test
     */

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(provider).toBeDefined();

        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'INVALID_METHOD',
                    params: [-1]
                })
        ).rejects.toThrowError();
    });

    /**
     * Custom RPC configuration tests
     */
    describe('Custom RPC configuration tests', () => {
        /**
         * Should return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountDefaultValue set to true
         */
        test('Should return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountMustReturn0 set to true', async () => {
            // Set the custom RPC configuration
            const providerWithCustomRPCConfiguration =
                new HardhatVeChainProvider(
                    new ProviderInternalBaseWallet([]),
                    TESTNET_URL,
                    (message: string, parent?: Error) =>
                        new Error(message, parent),
                    false,
                    false,
                    { ethGetTransactionCountMustReturn0: true }
                );

            // Call RPC function
            const rpcCall = await providerWithCustomRPCConfiguration.request({
                method: 'eth_getTransactionCount',
                params: ['0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', 'latest']
            });

            // Compare the result with the expected value
            expect(rpcCall).toBe('0x0');
        });

        /**
         * Should NOT return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountDefaultValue set to false
         */
        test('Should NOT return 0 when calling eth_getTransactionCount with rpcConfiguration.ethGetTransactionCountMustReturn0 set to false', async () => {
            // Set the custom RPC configuration
            const providerWithCustomRPCConfiguration =
                new HardhatVeChainProvider(
                    new ProviderInternalBaseWallet([]),
                    TESTNET_URL,
                    (message: string, parent?: Error) =>
                        new Error(message, parent),
                    false,
                    false,
                    { ethGetTransactionCountMustReturn0: false }
                );

            // Call RPC function
            const rpcCall = await providerWithCustomRPCConfiguration.request({
                method: 'eth_getTransactionCount',
                params: ['0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', 'latest']
            });

            // Compare the result with the expected value
            expect(rpcCall).not.toBe('0x0');
        });
    });
});
