import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { VechainProvider } from '../../src';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { mainNetwork } from '../fixture';
import { providerMethodsTestCasesMainnet } from './fixture';

/**
 * Vechain provider tests - Mainnet
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
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(mainNetwork);
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
    providerMethodsTestCasesMainnet.forEach(
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
