import { describe, expect, test } from '@jest/globals';
import { Int } from '@vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Test Int class.
 * @group unit/vcdm
 */
describe('Int', () => {
    describe('of', () => {
        test('should create an Int instance for a valid integer', () => {
            const intInstance = Int.of(5);
            expect(intInstance instanceof Int).toBe(true);
            expect(intInstance.valueOf()).toBe(5);
        });

        test('should throw an error for a non-integer number', () => {
            expect(() => Int.of(5.5)).toThrowError(IllegalArgumentError);
        });

        test('should throw an error for non-numeric input', () => {
            expect(() => Int.of(NaN)).toThrowError(IllegalArgumentError);
        });

        test('should throw an error for Infinity', () => {
            expect(() => Int.of(Infinity)).toThrowError(IllegalArgumentError);
        });

        test('should throw an error for -Infinity', () => {
            expect(() => Int.of(-Infinity)).toThrowError(IllegalArgumentError);
        });

        test('should create an Int instance for negative integers', () => {
            const intInstance = Int.of(-10);
            expect(intInstance instanceof Int).toBe(true);
            expect(intInstance.valueOf()).toBe(-10);
        });

        test('should create an Int instance for 0', () => {
            const intInstance = Int.of(0);
            expect(intInstance instanceof Int).toBe(true);
            expect(intInstance.valueOf()).toBe(0);
        });

        test('should create an Int instance for large integer values', () => {
            const largeInt = Math.pow(2, 53) - 1; // Max safe integer in JavaScript
            const intInstance = Int.of(largeInt);
            expect(intInstance instanceof Int).toBe(true);
            expect(intInstance.valueOf()).toBe(largeInt);
        });
    });
});
