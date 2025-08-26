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

    describe('resolveName(vnsName)', () => {
        test('Should be able to resolve an address by name', async () => {
            const name = 'clayton.vet';
            const address = await provider.resolveName(name);
            expect(address).toBe('0xC12B77B4467e3eDD6b16C978B8387a6A3Af8E8d7');
        });

        test('Should resolve to null for unknown names', async () => {
            const name = 'unknown.test-sdk.vet';
            const address = await provider.resolveName(name);
            expect(address).toBe(null);
        });
    });

    describe('lookupAddress(address)', () => {
        test('Should be able to lookup a name for an address', async () => {
            const address = '0xC12B77B4467e3eDD6b16C978B8387a6A3Af8E8d7';
            const name = await provider.lookupAddress(address);
            expect(name).toBe('clayton.vet');
        });

        test('Should resolve to null for unknown names', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            const name = await provider.resolveName(address);
            expect(name).toBe(null);
        });
    });
});
