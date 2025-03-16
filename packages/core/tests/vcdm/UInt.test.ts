import { describe, expect, test } from '@jest/globals';
import { IllegalArgumentError, UInt } from '../../src';

describe('UInt class', () => {
    describe('UInt.of', () => {
        test('should create an instance of UInt for a valid non-negative integer', () => {
            const result = UInt.of(5);
            expect(result).toBeInstanceOf(UInt);
        });

        test('should throw IllegalArgumentError for a negative integer', () => {
            expect(() => UInt.of(-1)).toThrow(IllegalArgumentError);
        });

        test('should throw IllegalArgumentError for a non-integer value', () => {
            expect(() => UInt.of(3.14)).toThrow(IllegalArgumentError);
        });

        test('should throw IllegalArgumentError for NaN', () => {
            expect(() => UInt.of(NaN)).toThrow(IllegalArgumentError);
        });

        test('should throw IllegalArgumentError for Infinity', () => {
            expect(() => UInt.of(Infinity)).toThrow(IllegalArgumentError);
        });

        test('should throw IllegalArgumentError for a non-number type', () => {
            expect(() => UInt.of('1' as unknown as number)).toThrow(
                IllegalArgumentError
            );
        });

        test('should work for zero as a valid case', () => {
            const result = UInt.of(0);
            expect(result).toBeInstanceOf(UInt);
        });
    });
});
