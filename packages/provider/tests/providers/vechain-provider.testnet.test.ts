import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { VechainProvider } from '../../src';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../fixture';
import { providerMethodsTestCasesTestnet } from './fixture';
import { logsFixture } from '../rpc-mapper/methods/eth_getLogs/fixture';
import { waitForMessage } from './helpers';

/**
 * Vechain provider tests
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
        thorClient = new ThorClient(testNetwork);
        provider = new VechainProvider(thorClient);
    });

    /**
     * Destory thor client and provider after each test
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

        const messageReceived = waitForMessage(provider);

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

    test('Should be able to get to subscribe to the latest logs', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['logs', logsFixture[0].input]
        });

        const messageReceived = waitForMessage(provider);

        const message = await messageReceived;

        provider.destroy();

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message.method).toBe('eth_subscription');
        expect(message.params).toBeDefined();

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
