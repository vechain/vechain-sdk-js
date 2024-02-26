import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { HardhatVechainProvider } from '../../../src';
import { mainnetUrl } from '../../fixture';
import { providerMethodsTestCasesMainnet } from '../fixture';
import {
    InvalidDataTypeError,
    JSONRPCInvalidRequest
} from '@vechain/vechain-sdk-errors';
import { BaseWallet } from '@vechain/vechain-sdk-wallet';

/**
 * Hardhat provider tests - Mainnet
 *
 * @group integration/providers/hardhat-provider-mainnet
 */
describe('Hardhat provider tests', () => {
    /**
     * Hardhat provider instances
     */
    let provider: HardhatVechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        provider = new HardhatVechainProvider(new BaseWallet([]), mainnetUrl);
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
     * The methods request, send, sendAsync must give the same result
     */
    test('Should be able to get chain id using request, send and sendAsync methods', async () => {
        // Call RPC function
        const rpcCall = await provider.send('eth_chainId', []);

        // Call RPC function using send method (same result as above)
        const rpcCallSend = await provider.send('eth_chainId', []);

        // Call RPC function using send-async method (same result as above)
        await provider.sendAsync(
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_chainId',
                params: []
            },
            (error, response) => {
                // Response should be defined
                expect(response).toBeDefined();

                // An error should not be thrown
                expect(error).toBeNull();

                // Expected result
                expect(response.result).toBe(rpcCall);
                expect(response.result).toBe(rpcCallSend);
            }
        );

        // Compare the result with the expected value
        expect(rpcCall).toBe(rpcCallSend);
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

        // Call RPC function and throw error using send method (same result as above)
        await expect(
            async () => await provider.send('INVALID_METHOD', [-1])
        ).rejects.toThrowError(JSONRPCInvalidRequest);

        // Call RPC function and throw error using send-async method (same result as above)
        await provider.sendAsync(
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'INVALID_METHOD',
                params: [-1]
            },
            (error, response) => {
                // Response should be undefined
                expect(response).toBeDefined();

                // An error should be thrown
                expect(error).toBeDefined();
            }
        );
    });
});
