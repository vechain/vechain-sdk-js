import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { type SubscriptionEvent, VechainProvider } from '../../src';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork } from '../fixture';
import { providerMethodsTestCasesSolo } from './fixture';
import { waitForMessage } from './helpers';

/**
 * Vechain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider
 */
describe('Vechain provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Inti thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(soloNetwork);
        provider = new VechainProvider(thorClient);
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
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        const messageReceived = new Promise((resolve) => {
            provider.on('message', (message) => {
                resolve(message);
                provider.destroy();
            });
        });

        const message = (await messageReceived) as SubscriptionEvent[];

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message[0].data).toBeDefined();
        expect(message[0].type).toBe('newBlock');

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    }, 12000);

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
        ).rejects.toThrowError('Invalid subscription type');
    }, 12000);

    /**
     * eth_getBalance RPC call test
     */

    test('Should be able to get to subscribe to the latest logs', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['logs', {}]
        });

        const messageReceived = waitForMessage(provider);

        const message = await messageReceived;

        provider.destroy();

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message[0].data).toBeDefined();

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    }, 20000);

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
        ).rejects.toThrowError(InvalidDataTypeError);
    });
});
