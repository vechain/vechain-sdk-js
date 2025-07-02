import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { HexUInt } from '@vechain/sdk-core';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    type SubscriptionEvent,
    THOR_SOLO_URL
} from '../../../../src';
import { providerMethodsTestCasesSolo } from '../fixture';
import { TEST_ACCOUNTS } from '../../../fixture';

/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
describe('Hardhat provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let provider: HardhatVeChainProvider;
    let fundedAccount: { privateKey: string; address: string };

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // Use a funded account from TEST_ACCOUNTS
        const account = TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION;
        fundedAccount = {
            privateKey: account.privateKey,
            address: account.address
        };
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([
                {
                    privateKey: HexUInt.of(fundedAccount.privateKey).bytes,
                    address: fundedAccount.address
                }
            ]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent),
            false
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
    providerMethodsTestCasesSolo.forEach(
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
     * eth_getBalance RPC call test
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
        const subscriptionId = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        const messageReceived = new Promise((resolve) => {
            provider.on('message', (message) => {
                resolve(message);
                provider.destroy();
            });
        });

        const message = (await messageReceived) as SubscriptionEvent;

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message.method).toBe('eth_subscription');
        expect(message.params).toBeDefined();
        expect(message.params.subscription).toBe(subscriptionId);
        expect(message.params.result).toBeDefined();
    }, 12000);

    /**
     * eth_subscribe latest blocks and then unsubscribe RPC call test
     */
    test('Should be able to get to subscribe to the latest blocks and then unsubscribe', async () => {
        expect(provider.getPollInstance()).toBeUndefined();
        // Call RPC function
        const subscriptionId = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        expect(provider.getPollInstance()).toBeDefined();

        expect(subscriptionId).toBeDefined();
        expect(
            provider.subscriptionManager.newHeadsSubscription?.subscriptionId
        ).toBe(subscriptionId);

        await provider.request({
            method: 'eth_unsubscribe',
            params: [subscriptionId]
        });

        expect(provider.getPollInstance()).toBeUndefined();

        expect(
            provider.subscriptionManager.newHeadsSubscription?.subscriptionId
        ).toBeUndefined();
    });

    /**
     * eth_getSubscribe invalid call
     */
    test('Should not be able to subscribe since the subscription type is invalid', async () => {
        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'eth_subscribe',
                    params: ['invalid']
                })
        ).rejects.toThrowError();
    }, 12000);

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
});
