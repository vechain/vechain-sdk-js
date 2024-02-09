import { test, describe, expect } from '@jest/globals';
import { subscriptionHelper } from '../../src';

/**
 * Test suite for the `generateRandomHex` method of the `subscriptionHelper`.
 * This suite verifies that the method behaves as expected under various conditions.
 * @group unit/helpers/subscription
 */
describe('subscriptionHelper.generateRandomHex', () => {
    /**
     * Tests that the `generateRandomHex` method returns a string of the correct length.
     * The length of the generated string should match the specified size.
     */
    test('should return a string of the correct length', () => {
        const size = 8;
        const hex = subscriptionHelper.generateRandomHex(size);
        expect(hex).toHaveLength(size);
    });

    /**
     * Ensures that the `generateRandomHex` method produces a string containing only valid hexadecimal characters.
     * The output should match a regular expression that allows only characters 0-9 and a-f.
     */
    test('should only contain hexadecimal characters', () => {
        const size = 8;
        const hex = subscriptionHelper.generateRandomHex(size);
        // This regex matches strings that only contain characters 0-9 and a-f
        expect(hex).toMatch(/^[0-9a-f]+$/);
    });

    /**
     * Verifies that consecutive calls to `generateRandomHex` return different values.
     * This test confirms the randomness and uniqueness of the generated strings over multiple invocations.
     */
    test('should return different values on subsequent calls', () => {
        const size = 8;
        const hex1 = subscriptionHelper.generateRandomHex(size);
        const hex2 = subscriptionHelper.generateRandomHex(size);
        expect(hex1).not.toEqual(hex2);
    });
});
