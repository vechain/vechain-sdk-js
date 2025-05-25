import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    HardhatVeChainProvider,
    JSONRPCEthersProvider,
    ProviderInternalBaseWallet,
    type SubscriptionEvent,
    TESTNET_URL
} from '../../../../src';

import { TESTNET_NETWORK } from '@vechain/sdk-core';
import { providerMethodsTestCasesTestnet } from '../fixture';

/**
 *VeChain provider tests - Test Network
 *
 * @group integration/providers/vechain-provider-testnet
 */
describe('Vechain provider tests - solo', () => {
    let hardhatVeChainProvider: HardhatVeChainProvider;
    let jsonRPCEthersProvider: JSONRPCEthersProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        hardhatVeChainProvider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            TESTNET_URL,
            (message: string, parent?: Error) => new Error(message, parent),
            false
        );
        jsonRPCEthersProvider = new JSONRPCEthersProvider(
            TESTNET_NETWORK.chainTag,
            TESTNET_URL,
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
    providerMethodsTestCasesTestnet.forEach(
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
        },
        8000
    );

    /**
     * eth_subscribe latest blocks RPC call test
     */
    jest.retryTimes(3);
    test('Should be able to get to subscribe to the latest blocks', async () => {
        const messageReceived = new Promise((resolve) => {
            void jsonRPCEthersProvider.on('block', (message) => {
                resolve(message);
                jsonRPCEthersProvider.destroy();
            });
        });

        const message = (await messageReceived) as SubscriptionEvent;

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
    }, 30000);

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
