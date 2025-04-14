import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_maxPriorityFeePerGas' method on Solo network
 *
 * @group integration/rpc-mapper/methods/eth_maxPriorityFeePerGas-solo
 */
describe('RPC Mapper - eth_maxPriorityFeePerGas method tests solo', () => {
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
     * eth_maxPriorityFeePerGas RPC call tests - Positive cases
     */
    describe('eth_maxPriorityFeePerGas - Positive cases', () => {
        test('Should return priority fee with proper format', async () => {
            const result = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([]);

            // Verify the result is a hex string
            expect(typeof result).toBe('string');
            expect(result).toMatch(/^0x[0-9a-f]+$/i);
        });

        test('Should return a valid non-zero priority fee', async () => {
            const result = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([]);

            // Convert hex to number
            const priorityFee = parseInt(result as string, 16);

            // Verify it's a positive number
            expect(priorityFee).toBeGreaterThan(0);
        });

        test('Should ignore any parameters passed', async () => {
            // Call with various parameters - they should all be ignored
            const result1 = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ](['some', 'random', 'params']);

            const result2 = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([123]);

            // Both should return valid hex strings
            expect(typeof result1).toBe('string');
            expect(result1).toMatch(/^0x[0-9a-f]+$/i);
            expect(typeof result2).toBe('string');
            expect(result2).toMatch(/^0x[0-9a-f]+$/i);
        });
    });

    /**
     * eth_maxPriorityFeePerGas RPC call tests - Edge cases
     */
    describe('eth_maxPriorityFeePerGas - Edge cases', () => {
        test('Should handle consecutive calls with consistent format', async () => {
            // Make multiple calls in succession
            const result1 = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([]);

            const result2 = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([]);

            // Both should be valid hex strings
            expect(result1).toMatch(/^0x[0-9a-f]+$/i);
            expect(result2).toMatch(/^0x[0-9a-f]+$/i);

            // Values might be the same in solo environment since they're called in quick succession
            // But no need to assert that as it depends on network conditions
        });

        test('Should return fee that can be converted to BigInt', async () => {
            const result = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_maxPriorityFeePerGas
            ]([]);

            // Should be able to convert to BigInt without errors
            expect(() => {
                BigInt(result as string);
            }).not.toThrow();

            // And the BigInt value should be positive
            const bigIntValue = BigInt(result as string);
            expect(bigIntValue > BigInt(0)).toBe(true);
        });
    });
});
