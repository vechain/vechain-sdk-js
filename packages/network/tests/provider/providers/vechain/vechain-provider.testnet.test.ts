import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { InvalidDataTypeError, ProviderRpcError } from '@vechain/sdk-errors';
import { testnetUrl } from '../../../fixture';
import { providerMethodsTestCasesTestnet } from '../fixture';
import { waitForMessage } from '../helpers';
import { ThorClient, VechainProvider } from '../../../../src';

/**
 * Vechain provider tests
 *
 * @group integration/providers/vechain-provider
 */
describe('Vechain provider tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(testnetUrl);
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

    /**
     * Invalid delegation
     */
    test('Should throw an error if delegation is enabled and delegator is not defined', () => {
        expect(() => {
            // eslint-disable-next-line no-new
            new VechainProvider(thorClient, undefined, true);
        }).toThrowError(ProviderRpcError);
    });

    /**
     * Return null signer if wallet is not defined
     */
    test('Should throw an error if delegation is enabled and delegator is not defined', async () => {
        const nullSigner = await provider.getSigner(
            '0x0000000000000000000000000000456e65726779'
        );
        expect(nullSigner).toBeNull();
    });
});
