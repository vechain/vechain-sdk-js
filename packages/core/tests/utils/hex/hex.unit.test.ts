import { describe, expect, test } from '@jest/globals';
import { Hex } from '../../../src/utils/hex/Hex';

describe('Hex', () => {
    test('should have a RADIX property with value 16', () => {
        expect(Hex.RADIX).toBe(16);
    });

    test('should have a PREFIX property with value 0x', () => {
        expect(Hex.PREFIX).toBe('0x');
    });

    test('should transform a number to its hexadecimal representation with a prefix', () => {
        expect(Hex.of0x(255)).toBe('0xff');
        expect(Hex.of0x(0)).toBe('0x0');

        // Test case for number which is not an integer
        expect(() => {
            Hex.of0x(2.667);
        }).toThrow();

        // Test case for negative number
        expect(() => {
            Hex.of0x(-10);
        }).toThrow();
    });

    test('pad', () => {
        console.log(Hex.of0x(255, 32));
    });
});
