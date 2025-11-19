"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper unit tests for 'eth_maxPriorityFeePerGas' method
 *
 * @group unit/rpc-mapper/methods/eth_maxPriorityFeePerGas
 */
(0, globals_1.describe)('RPC Mapper - eth_maxPriorityFeePerGas method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient;
    let provider;
    const mockPriorityFee = '0x9184e72a000'; // 100 Gwei
    const mockLowPriorityFee = '0x3b9aca00'; // 1 Gwei
    const mockHighPriorityFee = '0x174876e800'; // 1000 Gwei
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
        // Mock Galactica fork detection to return true by default
        jest.spyOn(thorClient.forkDetector, 'detectGalactica').mockResolvedValue(true);
    });
    (0, globals_1.test)('should return priority fee from /fees/priority endpoint when Galactica fork is active', async () => {
        // Mock the HTTP response
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            maxPriorityFeePerGas: mockPriorityFee
        });
        const result = await provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });
        (0, globals_1.expect)(result).toBe(mockPriorityFee);
    });
    (0, globals_1.test)('should throw a method not implemented error when Galactica fork is not active', async () => {
        // Mock Galactica fork detection to return false
        jest.spyOn(thorClient.forkDetector, 'detectGalactica').mockResolvedValue(false);
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        })).rejects.toThrow(sdk_errors_1.JSONRPCMethodNotImplemented);
    });
    (0, globals_1.test)('should handle low priority fee values', async () => {
        // Mock the HTTP response with a low priority fee
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            maxPriorityFeePerGas: mockLowPriorityFee
        });
        const result = await provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });
        (0, globals_1.expect)(result).toBe(mockLowPriorityFee);
    });
    (0, globals_1.test)('should handle high priority fee values', async () => {
        // Mock the HTTP response with a high priority fee
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            maxPriorityFeePerGas: mockHighPriorityFee
        });
        const result = await provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });
        (0, globals_1.expect)(result).toBe(mockHighPriorityFee);
    });
    (0, globals_1.test)('should handle empty response from /fees/priority endpoint', async () => {
        // Mock the HTTP response with an empty object
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({});
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        })).rejects.toThrow(sdk_errors_1.JSONRPCInternalError);
    });
    (0, globals_1.test)('should handle null response from /fees/priority endpoint', async () => {
        // Mock the HTTP response with null
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue(null);
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        })).rejects.toThrow(sdk_errors_1.JSONRPCInternalError);
    });
    (0, globals_1.test)('should handle network errors gracefully', async () => {
        // Mock the HTTP response with a network error
        jest.spyOn(thorClient.httpClient, 'get').mockRejectedValue(new Error('Network error'));
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        })).rejects.toThrow(sdk_errors_1.JSONRPCInternalError);
    });
    (0, globals_1.test)('should handle malformed response from /fees/priority endpoint', async () => {
        // Mock the HTTP response with invalid data
        jest.spyOn(thorClient.httpClient, 'get').mockResolvedValue({
            invalidField: 'some value'
        });
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        })).rejects.toThrow(sdk_errors_1.JSONRPCInternalError);
    });
});
