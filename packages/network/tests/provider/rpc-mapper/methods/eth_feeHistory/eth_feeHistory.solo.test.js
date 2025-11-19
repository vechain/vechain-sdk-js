"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_feeHistory' method on Solo network
 *
 * @group integration/rpc-mapper/methods/eth_feeHistory-solo
 */
(0, globals_1.describe)('RPC Mapper - eth_feeHistory method tests solo', () => {
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
     * eth_feeHistory RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_feeHistory - Positive cases', () => {
        (0, globals_1.test)('Should return fee history with the correct structure', async () => {
            const result = await (0, test_utils_1.retryOperation)(async () => {
                return (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([4, 'latest', [25, 75]]));
            });
            // Verify result is an object with expected properties
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            (0, globals_1.expect)(result).toHaveProperty('oldestBlock');
            (0, globals_1.expect)(result).toHaveProperty('baseFeePerGas');
            (0, globals_1.expect)(result).toHaveProperty('gasUsedRatio');
            // Check that baseFeePerGas is an array of expected length
            (0, globals_1.expect)(Array.isArray(result.baseFeePerGas)).toBe(true);
            (0, globals_1.expect)(result.baseFeePerGas.length).toBe(4); // Equal to blockCount
            // Check that gasUsedRatio is an array of expected length
            (0, globals_1.expect)(Array.isArray(result.gasUsedRatio)).toBe(true);
            (0, globals_1.expect)(result.gasUsedRatio.length).toBe(4); // blockCount
            // If rewardPercentiles were provided, check that reward is present
            if (result.reward !== undefined && result.reward !== null) {
                (0, globals_1.expect)(Array.isArray(result.reward)).toBe(true);
                (0, globals_1.expect)(result.reward.length).toBe(4); // blockCount
                // Each element should be an array with length equal to number of percentiles
                if (result.reward[0] !== undefined &&
                    result.reward[0] !== null) {
                    (0, globals_1.expect)(Array.isArray(result.reward[0])).toBe(true);
                    (0, globals_1.expect)(result.reward[0].length).toBe(2); // Two percentiles: 25, 75
                }
            }
        });
        (0, globals_1.test)('Should handle numeric block number', async () => {
            const result = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([4, 0, [25, 75]]));
            // Verify result is an object with expected properties
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            (0, globals_1.expect)(result).toHaveProperty('oldestBlock');
            (0, globals_1.expect)(typeof result.oldestBlock).toBe('string');
        });
        (0, globals_1.test)('Should work without rewardPercentiles parameter', async () => {
            const result = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([4, 'latest']));
            // Verify result is an object with expected properties
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            (0, globals_1.expect)(result).toHaveProperty('oldestBlock');
            (0, globals_1.expect)(result).toHaveProperty('baseFeePerGas');
            (0, globals_1.expect)(result).toHaveProperty('gasUsedRatio');
            // Without rewardPercentiles, there should be no reward property
            (0, globals_1.expect)(result.reward).toBeUndefined();
        });
    });
    /**
     * eth_feeHistory RPC call tests - Special cases
     */
    (0, globals_1.describe)('eth_feeHistory - Special cases', () => {
        (0, globals_1.test)('Should work with block number 0 as identifier', async () => {
            const result = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([4, 0, [25, 75]]));
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            (0, globals_1.expect)(result).toHaveProperty('oldestBlock');
            (0, globals_1.expect)(result).toHaveProperty('baseFeePerGas');
        });
        (0, globals_1.test)('Should work with single percentile value', async () => {
            const result = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([4, 'latest', [50]]));
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            // If rewards are present, each reward array should have length 1
            if (result.reward !== undefined && result.reward !== null) {
                if (result.reward[0] !== undefined &&
                    result.reward[0] !== null) {
                    (0, globals_1.expect)(Array.isArray(result.reward[0])).toBe(true);
                    (0, globals_1.expect)(result.reward[0].length).toBe(1); // Only one percentile
                }
            }
        });
        (0, globals_1.test)('Should handle ascending percentiles', async () => {
            const result = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([4, 'latest', [25, 50, 75]])); // Ordered percentiles
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            // If rewards are present, each reward array should have length 3
            if (result.reward !== undefined && result.reward !== null) {
                if (result.reward[0] !== undefined &&
                    result.reward[0] !== null) {
                    (0, globals_1.expect)(Array.isArray(result.reward[0])).toBe(true);
                    (0, globals_1.expect)(result.reward[0].length).toBe(3); // Three percentiles
                }
            }
        });
        (0, globals_1.test)('Should handle large blockCount value', async () => {
            // Use a larger blockCount than usual
            const result = (await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([10, 'latest', [50]]));
            (0, globals_1.expect)(typeof result).toBe('object');
            (0, globals_1.expect)(result).not.toBeNull();
            (0, globals_1.expect)(result).toHaveProperty('baseFeePerGas');
            // The arrays should match the requested blockCount
            if (result.baseFeePerGas !== undefined) {
                (0, globals_1.expect)(result.baseFeePerGas.length).toBeLessThanOrEqual(11); // blockCount + 1
                (0, globals_1.expect)(result.baseFeePerGas.length).toBeGreaterThan(0);
            }
            if (result.gasUsedRatio !== undefined) {
                (0, globals_1.expect)(result.gasUsedRatio.length).toBeLessThanOrEqual(10); // blockCount
                (0, globals_1.expect)(result.gasUsedRatio.length).toBeGreaterThan(0);
            }
        });
    });
    /**
     * eth_feeHistory RPC call tests - Parameter validation
     */
    (0, globals_1.describe)('eth_feeHistory - Parameter validation', () => {
        (0, globals_1.test)('Should reject invalid blockCount', async () => {
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([
                0, // Invalid blockCount
                'latest',
                [25, 75]
            ])).rejects.toThrow();
        });
        (0, globals_1.test)('Should reject missing newestBlock', async () => {
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([
                4 // Missing newestBlock
            ])).rejects.toThrow();
        });
        (0, globals_1.test)('Should reject negative blockCount', async () => {
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([
                -1, // Negative blockCount
                'latest',
                [25, 75]
            ])).rejects.toThrow();
        });
        (0, globals_1.test)('Should reject invalid percentiles outside 0-100 range', async () => {
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([
                4,
                'latest',
                [101] // Invalid percentile (> 100)
            ])).rejects.toThrow();
            await (0, globals_1.expect)((0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_feeHistory]([
                4,
                'latest',
                [-1] // Invalid percentile (< 0)
            ])).rejects.toThrow();
        });
    });
});
