import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { JSONRPCMethodNotFound } from '@vechain/sdk-errors';
import { mainNetwork } from '../../../fixture';
import { providerMethodsTestCasesMainnet } from '../fixture';
import { ThorClient, VeChainProvider } from '../../../../src';

/**
 *VeChain provider tests - Mainnet
 *
 * @group integration/providers/vechain-provider-mainnet
 */
describe('VeChain provider tests - mainnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(mainNetwork);
        provider = new VeChainProvider(thorClient);
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
        ).rejects.toThrowError(JSONRPCMethodNotFound);
    });
});
