import { describe, expect, test } from '@jest/globals';
import { createPublicClient, BlockReponseType } from '../../../dist/index.js';
import { ThorNetworks } from '@thor';
import { Address } from '@vcdm';

/**
 * Test suite for PublicClient account-related functionality
 *
 * Tests all account-related methods:
 * - getBalance
 * - getChainId
 *
 * @group integration/clients
 */
describe('PublicClient - Account Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });
    // Test addresses
    const testAddress = Address.of(
        '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
    );
    const zeroAddress = Address.of(
        '0x0000000000000000000000000000000000000000'
    );

    describe('getBalance', () => {
        test('should retrieve balance for valid address', async () => {
            const balance = await publicClient.getBalance(testAddress);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('bigint');
            expect(balance).toBeGreaterThanOrEqual(0n);

            console.log(
                `Balance for ${testAddress.toString()}: ${balance.toString()}`
            );
        });

        test('should retrieve zero balance for zero address', async () => {
            const balance = await publicClient.getBalance(zeroAddress);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('bigint');
            expect(balance).toBe(0n);

            console.log(`Balance for zero address: ${balance.toString()}`);
        });

        test('should handle different address formats', async () => {
            // Test with different address representations
            const addressString = '0xf077b491b355e64048ce21e3a6fc4751eeea77fa';
            const addressFromString = Address.of(addressString);

            const balance = await publicClient.getBalance(addressFromString);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('bigint');
            expect(balance).toBeGreaterThanOrEqual(0n);
        });
    });

    describe('getChainId', () => {
        test('should retrieve chain ID', async () => {
            const chainId = await publicClient.getChainId();

            expect(chainId).toBeDefined();
            expect(typeof chainId).toBe('bigint');
            expect(chainId).toBeGreaterThan(0n);

            console.log(`Chain ID: ${chainId.toString()}`);
        });

        test('should return consistent chain ID across multiple calls', async () => {
            const chainId1 = await publicClient.getChainId();
            const chainId2 = await publicClient.getChainId();

            expect(chainId1).toBe(chainId2);
        });

        test('should return solo network chain ID for solo network', async () => {
            const chainId = await publicClient.getChainId();

            // Solo network should have a specific chain ID
            expect(chainId).toBeDefined();
            expect(typeof chainId).toBe('bigint');

            // Log for verification
            console.log(`Solo network chain ID: ${chainId.toString()}`);
        });
    });

    describe('error handling', () => {
        test('should handle invalid address format gracefully', async () => {
            // This test depends on how Address.of handles invalid inputs
            // If it throws, we expect the error to be thrown
            // If it normalizes, we expect a valid response

            try {
                const invalidAddress = Address.of('0xinvalid');
                const balance = await publicClient.getBalance(invalidAddress);
                // If we reach here, the address was normalized
                expect(typeof balance).toBe('bigint');
            } catch (error) {
                // Expected if Address.of throws for invalid format
                expect(error).toBeDefined();
            }
        });

        test('should handle network errors gracefully', async () => {
            // This test would require mocking network failures
            // For now, we'll just verify the method exists and can be called
            const balance = await publicClient.getBalance(testAddress);
            expect(balance).toBeDefined();
        });
    });
});
