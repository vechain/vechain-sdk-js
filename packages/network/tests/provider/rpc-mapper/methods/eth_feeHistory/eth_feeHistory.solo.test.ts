import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { type FeeHistoryResponse } from '../../../../../src/thor-client/gas/types';

/**
 * RPC Mapper integration tests for 'eth_feeHistory' method on Solo network
 *
 * @group integration/rpc-mapper/methods/eth_feeHistory-solo
 */
describe('RPC Mapper - eth_feeHistory method tests solo', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * eth_feeHistory RPC call tests - Positive cases
     */
    describe('eth_feeHistory - Positive cases', () => {
        test('Should return fee history with the correct structure', async () => {
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([4, 'latest', [25, 75]])) as FeeHistoryResponse;

            // Verify result is an object with expected properties
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('oldestBlock');
            expect(result).toHaveProperty('baseFeePerGas');
            expect(result).toHaveProperty('gasUsedRatio');

            // Check that baseFeePerGas is an array of expected length
            expect(Array.isArray(result.baseFeePerGas)).toBe(true);
            expect(result.baseFeePerGas.length).toBe(4); // Equal to blockCount

            // Check that gasUsedRatio is an array of expected length
            expect(Array.isArray(result.gasUsedRatio)).toBe(true);
            expect(result.gasUsedRatio.length).toBe(4); // blockCount

            // If rewardPercentiles were provided, check that reward is present
            if (result.reward !== undefined && result.reward !== null) {
                expect(Array.isArray(result.reward)).toBe(true);
                expect(result.reward.length).toBe(4); // blockCount

                // Each element should be an array with length equal to number of percentiles
                if (
                    result.reward[0] !== undefined &&
                    result.reward[0] !== null
                ) {
                    expect(Array.isArray(result.reward[0])).toBe(true);
                    expect(result.reward[0].length).toBe(2); // Two percentiles: 25, 75
                }
            }
        });

        test('Should handle numeric block number', async () => {
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([4, 0, [25, 75]])) as FeeHistoryResponse;

            // Verify result is an object with expected properties
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('oldestBlock');
            expect(typeof result.oldestBlock).toBe('string');
        });

        test('Should work without rewardPercentiles parameter', async () => {
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([4, 'latest'])) as FeeHistoryResponse;

            // Verify result is an object with expected properties
            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('oldestBlock');
            expect(result).toHaveProperty('baseFeePerGas');
            expect(result).toHaveProperty('gasUsedRatio');

            // Without rewardPercentiles, there should be no reward property
            expect(result.reward).toBeUndefined();
        });
    });

    /**
     * eth_feeHistory RPC call tests - Special cases
     */
    describe('eth_feeHistory - Special cases', () => {
        test('Should work with block number 0 as identifier', async () => {
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([4, 0, [25, 75]])) as FeeHistoryResponse;

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('oldestBlock');
            expect(result).toHaveProperty('baseFeePerGas');
        });

        test('Should work with single percentile value', async () => {
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([4, 'latest', [50]])) as FeeHistoryResponse;

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();

            // If rewards are present, each reward array should have length 1
            if (result.reward !== undefined && result.reward !== null) {
                if (
                    result.reward[0] !== undefined &&
                    result.reward[0] !== null
                ) {
                    expect(Array.isArray(result.reward[0])).toBe(true);
                    expect(result.reward[0].length).toBe(1); // Only one percentile
                }
            }
        });

        test('Should handle ascending percentiles', async () => {
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([4, 'latest', [25, 50, 75]])) as FeeHistoryResponse; // Ordered percentiles

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();

            // If rewards are present, each reward array should have length 3
            if (result.reward !== undefined && result.reward !== null) {
                if (
                    result.reward[0] !== undefined &&
                    result.reward[0] !== null
                ) {
                    expect(Array.isArray(result.reward[0])).toBe(true);
                    expect(result.reward[0].length).toBe(3); // Three percentiles
                }
            }
        });

        test('Should handle large blockCount value', async () => {
            // Use a larger blockCount than usual
            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_feeHistory
            ]([10, 'latest', [50]])) as FeeHistoryResponse;

            expect(typeof result).toBe('object');
            expect(result).not.toBeNull();
            expect(result).toHaveProperty('baseFeePerGas');

            // The arrays should match the requested blockCount
            if (result.baseFeePerGas !== undefined) {
                expect(result.baseFeePerGas.length).toBeLessThanOrEqual(11); // blockCount + 1
                expect(result.baseFeePerGas.length).toBeGreaterThan(0);
            }

            if (result.gasUsedRatio !== undefined) {
                expect(result.gasUsedRatio.length).toBeLessThanOrEqual(10); // blockCount
                expect(result.gasUsedRatio.length).toBeGreaterThan(0);
            }
        });
    });

    /**
     * eth_feeHistory RPC call tests - Parameter validation
     */
    describe('eth_feeHistory - Parameter validation', () => {
        test('Should reject invalid blockCount', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory]([
                    0, // Invalid blockCount
                    'latest',
                    [25, 75]
                ])
            ).rejects.toThrow();
        });

        test('Should reject missing newestBlock', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory]([
                    4 // Missing newestBlock
                ])
            ).rejects.toThrow();
        });

        test('Should reject negative blockCount', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory]([
                    -1, // Negative blockCount
                    'latest',
                    [25, 75]
                ])
            ).rejects.toThrow();
        });

        test('Should reject invalid percentiles outside 0-100 range', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory]([
                    4,
                    'latest',
                    [101] // Invalid percentile (> 100)
                ])
            ).rejects.toThrow();

            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_feeHistory]([
                    4,
                    'latest',
                    [-1] // Invalid percentile (< 0)
                ])
            ).rejects.toThrow();
        });
    });
});
