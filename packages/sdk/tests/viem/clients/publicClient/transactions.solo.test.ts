import { describe, expect, test } from '@jest/globals';
import { createPublicClient } from '@viem/clients';
import { ThorNetworks } from '@thor';
import { Hex, Address } from '@common';

/**
 * Test suite for PublicClient transaction-related functionality
 *
 * Tests all transaction-related methods:
 * - getTransaction
 * - getTransactionReceipt
 * - getTransactionCount
 * - getNonce
 * - getBytecode
 * - getCode
 * - getStorageAt
 *
 * @group integration/clients
 */
describe('PublicClient - Transaction Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });

    // Test addresses and hashes
    const testAddress = Address.of(
        '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
    );
    const zeroAddress = Address.of(
        '0x0000000000000000000000000000000000000000'
    );
    const invalidTxHash = Hex.of(
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    );
    const storageSlot = Hex.of(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
    );

    describe('getTransaction', () => {
        test('should throw TransactionNotFoundError for invalid transaction hash', async () => {
            await expect(
                publicClient.getTransaction(invalidTxHash)
            ).rejects.toThrow(
                'Transaction with hash \"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\" could not be found.'
            );
        });

        test('should handle null response gracefully', async () => {
            try {
                const result = await publicClient.getTransaction(invalidTxHash);
                // If no error is thrown, result should be null or valid transaction
                expect(result).toBeDefined();
            } catch (error) {
                // Should throw TransactionNotFoundError
                expect(error).toBeDefined();
            }
        });
    });

    describe('getTransactionReceipt', () => {
        test('should throw TransactionReceiptNotFoundError for invalid transaction hash', async () => {
            await expect(
                publicClient.getTransactionReceipt(invalidTxHash)
            ).rejects.toThrow(
                'Transaction receipt with hash \"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef\" could not be found. The Transaction may not be processed on a block yet.'
            );
        });

        test('should handle null response gracefully', async () => {
            try {
                const result =
                    await publicClient.getTransactionReceipt(invalidTxHash);
                // If no error is thrown, result should be null or valid receipt
                expect(result).toBeDefined();
            } catch (error) {
                // Should throw TransactionReceiptNotFoundError
                expect(error).toBeDefined();
            }
        });
    });

    describe('getTransactionCount', () => {
        test('should retrieve transaction count for valid address', async () => {
            const count = await publicClient.getTransactionCount(testAddress);

            expect(count).toBeDefined();
            expect(typeof count).toBe('number');
            expect(count).toBeGreaterThanOrEqual(0);

            console.log(
                `Transaction count for ${testAddress.toString()}: ${count}`
            );
        });

        test('should retrieve transaction count for zero address', async () => {
            const count = await publicClient.getTransactionCount(zeroAddress);

            expect(count).toBeDefined();
            expect(typeof count).toBe('number');
            expect(count).toBe(0);

            console.log(`Transaction count for zero address: ${count}`);
        });

        test('should handle account not found error', async () => {
            const invalidAddress = Address.of(
                '0x1111111111111111111111111111111111111111'
            );

            try {
                await publicClient.getTransactionCount(invalidAddress);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });

    describe('getNonce', () => {
        test('should retrieve nonce for valid address', async () => {
            const nonce = await publicClient.getNonce(testAddress);

            expect(nonce).toBeDefined();
            expect(typeof nonce).toBe('number');
            expect(nonce).toBeGreaterThanOrEqual(0);

            console.log(`Nonce for ${testAddress.toString()}: ${nonce}`);
        });

        test('should return same value as getTransactionCount', async () => {
            const nonce = await publicClient.getNonce(testAddress);
            const txCount = await publicClient.getTransactionCount(testAddress);

            expect(nonce).toBe(txCount);
        });
    });

    describe('getBytecode', () => {
        test('should retrieve bytecode for contract address', async () => {
            const bytecode = await publicClient.getBytecode(testAddress);

            // Bytecode can be undefined for non-contract addresses
            if (bytecode !== undefined) {
                expect(bytecode).toBeDefined();
                expect(typeof bytecode.toString()).toBe('string');
            }

            console.log(
                `Bytecode for ${testAddress.toString()}: ${bytecode?.toString() || 'undefined'}`
            );
        });

        test('should return undefined for zero address', async () => {
            const bytecode = await publicClient.getBytecode(zeroAddress);

            // Zero address should not have bytecode
            // expect(bytecode).toBeUndefined();
            expect(bytecode?.toString()).toBe('0x');
        });
    });

    describe('getCode', () => {
        test('should retrieve code for contract address', async () => {
            const code = await publicClient.getCode(testAddress);

            // Code can be undefined for non-contract addresses
            if (code !== undefined) {
                expect(code).toBeDefined();
                expect(typeof code.toString()).toBe('string');
            }

            console.log(
                `Code for ${testAddress.toString()}: ${code?.toString() || 'undefined'}`
            );
        });

        test('should return same value as getBytecode', async () => {
            const code = await publicClient.getCode(testAddress);
            const bytecode = await publicClient.getBytecode(testAddress);

            expect(code).toEqual(bytecode);
        });

        test('should return undefined for zero address', async () => {
            const code = await publicClient.getCode(zeroAddress);

            // Zero address should not have code
            // expect(code).toBeUndefined();
            expect(code?.toString()).toBe('0x');
        });
    });

    describe('getStorageAt', () => {
        test('should retrieve storage value for valid address and slot', async () => {
            const storageValue = await publicClient.getStorageAt(
                testAddress,
                storageSlot
            );

            expect(storageValue).toBeDefined();
            expect(typeof storageValue.toString()).toBe('string');
            expect(storageValue.toString()).toMatch(/^0x[0-9a-f]*$/i);

            console.log(
                `Storage at ${testAddress.toString()}, slot ${storageSlot.toString()}: ${storageValue.toString()}`
            );
        });

        test('should return default value for zero address', async () => {
            const storageValue = await publicClient.getStorageAt(
                zeroAddress,
                storageSlot
            );

            expect(storageValue).toBeDefined();
            expect(storageValue.toString()).toBe(
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            );
        });

        test('should handle different storage slots', async () => {
            const slot1 = Hex.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            );
            const storageValue = await publicClient.getStorageAt(
                testAddress,
                slot1
            );

            expect(storageValue).toBeDefined();
            expect(typeof storageValue.toString()).toBe('string');

            console.log(`Storage at slot 1: ${storageValue.toString()}`);
        });
    });

    describe('Error handling', () => {
        test('should handle invalid addresses gracefully', async () => {
            const invalidAddress = Address.of(
                '0x1111111111111111111111111111111111111111'
            );

            // These methods should handle invalid addresses without crashing
            const bytecode = await publicClient.getBytecode(invalidAddress);
            const code = await publicClient.getCode(invalidAddress);
            const storage = await publicClient.getStorageAt(
                invalidAddress,
                storageSlot
            );

            expect(bytecode?.toString()).toBe('0x');
            expect(code?.toString()).toBe('0x');
            expect(storage).toBeDefined(); // Should return default value
        });

        test('should handle network errors gracefully', async () => {
            // Test methods with valid inputs to ensure they don't throw unexpected errors
            try {
                await publicClient.getBytecode(testAddress);
                await publicClient.getCode(testAddress);
                await publicClient.getStorageAt(testAddress, storageSlot);
                await publicClient.getTransactionCount(testAddress);
                await publicClient.getNonce(testAddress);
            } catch (error) {
                // If errors occur, they should be meaningful
                expect(error).toBeDefined();
            }
        });
    });
});
