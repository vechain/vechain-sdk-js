import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import { JSONRPCInternalError } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_maxPriorityFeePerGas' method
 *
 * @group integration/rpc-mapper/methods/eth_maxPriorityFeePerGas
 */
describe('RPC Mapper - eth_maxPriorityFeePerGas method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;
    const mockPriorityFee = '0x9184e72a000'; // 100 Gwei
    const mockLowPriorityFee = '0x3b9aca00'; // 1 Gwei
    const mockHighPriorityFee = '0x174876e800'; // 1000 Gwei

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
    });

    test('should return priority fee from /fees/priority endpoint', async () => {
        // Mock the HTTP response
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            maxPriorityFeePerGas: mockPriorityFee
        });

        const result = await provider.request({
            method: RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });

        expect(result).toBe(mockPriorityFee);
    });

    test('should handle low priority fee values', async () => {
        // Mock the HTTP response with a low priority fee
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            maxPriorityFeePerGas: mockLowPriorityFee
        });

        const result = await provider.request({
            method: RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });

        expect(result).toBe(mockLowPriorityFee);
    });

    test('should handle high priority fee values', async () => {
        // Mock the HTTP response with a high priority fee
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            maxPriorityFeePerGas: mockHighPriorityFee
        });

        const result = await provider.request({
            method: RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });

        expect(result).toBe(mockHighPriorityFee);
    });

    test('should handle empty response from /fees/priority endpoint', async () => {
        // Mock the HTTP response with an empty object
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({});

        await expect(
            provider.request({
                method: RPC_METHODS.eth_maxPriorityFeePerGas,
                params: []
            })
        ).rejects.toThrow(JSONRPCInternalError);
    });

    test('should handle null response from /fees/priority endpoint', async () => {
        // Mock the HTTP response with null
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue(null);

        await expect(
            provider.request({
                method: RPC_METHODS.eth_maxPriorityFeePerGas,
                params: []
            })
        ).rejects.toThrow(JSONRPCInternalError);
    });

    test('should handle network errors gracefully', async () => {
        // Mock the HTTP response with a network error
        jest.spyOn(thorClient.httpClient, 'get').mockRejectedValue(
            new Error('Network error')
        );

        await expect(
            provider.request({
                method: RPC_METHODS.eth_maxPriorityFeePerGas,
                params: []
            })
        ).rejects.toThrow(JSONRPCInternalError);
    });

    test('should handle malformed response from /fees/priority endpoint', async () => {
        // Mock the HTTP response with invalid data
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            invalidField: 'some value'
        });

        await expect(
            provider.request({
                method: RPC_METHODS.eth_maxPriorityFeePerGas,
                params: []
            })
        ).rejects.toThrow(JSONRPCInternalError);
    });
});
