"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
/**
 * RPC Mapper integration tests for 'eth_maxPriorityFeePerGas' method on Solo network
 *
 * @group integration/rpc-mapper/methods/eth_maxPriorityFeePerGas-solo
 */
(0, globals_1.describe)('RPC Mapper - eth_maxPriorityFeePerGas method tests solo', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * Helper function to retry RPC calls with exponential backoff
     */
    const retryRPCCall = async (rpcMethod, maxAttempts = 3) => {
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await rpcMethod();
            }
            catch (error) {
                lastError = error;
                // Check if it's a network communication error
                const isNetworkError = error instanceof sdk_errors_1.HttpNetworkError;
                if (isNetworkError && attempt < maxAttempts) {
                    // Wait with exponential backoff: 1s, 2s, 4s
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                // If it's not a network error or we've exhausted attempts, throw
                throw error instanceof Error ? error : new Error(String(error));
            }
        }
        throw lastError ?? new Error('Unknown error');
    };
    /**
     * eth_maxPriorityFeePerGas RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_maxPriorityFeePerGas - Positive cases', () => {
        (0, globals_1.test)('Should return priority fee with proper format', async () => {
            const result = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas]([]));
            // Verify the result is a hex string
            (0, globals_1.expect)(typeof result).toBe('string');
            (0, globals_1.expect)(result).toMatch(/^0x[0-9a-f]+$/i);
        });
        (0, globals_1.test)('Should return a valid non-zero priority fee', async () => {
            const result = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas]([]));
            // Convert hex to number
            const priorityFee = parseInt(result, 16);
            // Verify it's a positive number
            (0, globals_1.expect)(priorityFee).toBeGreaterThan(0);
        });
        (0, globals_1.test)('Should ignore any parameters passed', async () => {
            // Call with various parameters - they should all be ignored
            const result1 = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas](['some', 'random', 'params']));
            const result2 = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas]([123]));
            // Both should return valid hex strings
            (0, globals_1.expect)(typeof result1).toBe('string');
            (0, globals_1.expect)(result1).toMatch(/^0x[0-9a-f]+$/i);
            (0, globals_1.expect)(typeof result2).toBe('string');
            (0, globals_1.expect)(result2).toMatch(/^0x[0-9a-f]+$/i);
        });
    });
    /**
     * eth_maxPriorityFeePerGas RPC call tests - Edge cases
     */
    (0, globals_1.describe)('eth_maxPriorityFeePerGas - Edge cases', () => {
        (0, globals_1.test)('Should handle consecutive calls with consistent format', async () => {
            // Make multiple calls in succession
            const result1 = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas]([]));
            const result2 = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas]([]));
            // Both should be valid hex strings
            (0, globals_1.expect)(result1).toMatch(/^0x[0-9a-f]+$/i);
            (0, globals_1.expect)(result2).toMatch(/^0x[0-9a-f]+$/i);
            // Values might be the same in solo environment since they're called in quick succession
            // But no need to assert that as it depends on network conditions
        });
        (0, globals_1.test)('Should return fee that can be converted to BigInt', async () => {
            const result = await retryRPCCall(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_maxPriorityFeePerGas]([]));
            // Should be able to convert to BigInt without errors
            (0, globals_1.expect)(() => {
                BigInt(result);
            }).not.toThrow();
            // And the BigInt value should be positive
            const bigIntValue = BigInt(result);
            (0, globals_1.expect)(bigIntValue > BigInt(0)).toBe(true);
        });
    });
});
