import { describe, expect, test } from '@jest/globals';
import { Hex } from '../../../src/utils/hex/Hex';

describe('Hex', () => {
    test('should have a RADIX property with value 16', () => {
        expect(Hex.RADIX).toBe(16);
    });

    test('should have a PREFIX property with value 0x', () => {
        expect(Hex.PREFIX).toBe('0x');
    });

    test('test', () => {
        console.log(Hex.of(-10));
    });

    test('should transform a number to its hexadecimal representation with a prefix', () => {
        expect(Hex.of(255)).toBe('0xff');
        expect(Hex.of(0)).toBe('0x0');

        // Test case for number which is not an integer
        expect(() => {
            Hex.of(2.667);
        }).toThrow();

        // Test case for negative number
        expect(() => {
            Hex.of(-10);
        }).toThrow();
    });
});
