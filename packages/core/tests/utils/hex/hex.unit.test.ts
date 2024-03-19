import { describe, expect, test } from '@jest/globals';
import { H0x, Hex, Quantity } from '../../../src';

/**
 * Text Hex representation from TS types prefixed with `0x`.
 * @group unit/utils/hex
 */
describe('H0x', () => {
    test('of bigint', () => {
        const output: string = H0x.of(BigInt(10), 0);
        expect(output).toBe('0x0a');
    });

    test('of Buffer', () => {
        const buffer: Uint8Array = Buffer.from(new Uint8Array(1));
        buffer[0] = 10;
        const output: string = H0x.of(buffer, 0);
        expect(output).toBe('0x0a');
    });

    test('of Uint8Array', () => {
        const uint8Array: Uint8Array = new Uint8Array(1);
        uint8Array[0] = 10;
        const output: string = H0x.of(uint8Array, 0);
        expect(output).toBe('0x0a');
    });

    test('of number', () => {
        const output: string = H0x.of(10 as number, 0);
        expect(output).toBe('0x0a');
    });

    test('of string', () => {
        const output: string = H0x.of('a' as string, 0);
        expect(output).toBe('0x61');
    });

    test('padded', () => {
        const output: string = H0x.of('a', 2);
        expect(output).toBe('0x0061');
    });

    test('isValid - true', () => {
        const output: boolean = H0x.isValid('0x12ef');
        expect(output).toBe(true);
    });

    test('isValid - true - optional 0x', () => {
        expect(H0x.isValid('12ef', true)).toBe(true);
        expect(H0x.isValid('0x12ef', true)).toBe(true);
    });

    test('isValid - false - no 0x', () => {
        const output: boolean = H0x.isValid('12ef');
        expect(output).toBe(false);
    });

    test('isValid - false - no hex', () => {
        const output: boolean = H0x.isValid('12fg');
        expect(output).toBe(false);
    });

    test('isValid - false - no hex', () => {
        const output: boolean = H0x.isValid('12fg');
        expect(output).toBe(false);
    });

    test('isValid - false - byte aligned', () => {
        const output: boolean = H0x.isValid('12e', true, true);
        expect(output).toBe(false);
    });

    test('isValid - true - byte aligned', () => {
        const output: boolean = H0x.isValid('12ef', true, true);
        expect(output).toBe(true);
    });
});

/**
 * Text Hex representation from TS types.
 * @group unit/utils/hex
 */
describe('Hex', () => {
    test('of bigint', () => {
        const output: string = Hex.of(BigInt(10));
        expect(output).toBe('0a');

        expect(() => {
            Hex.of(BigInt(-10), 0);
        }).toThrow("Arg 'n' not negative.");
    });

    test('of Buffer', () => {
        const buffer: Uint8Array = Buffer.from(new Uint8Array(1));
        buffer[0] = 10;
        const output: string = Hex.of(buffer);
        expect(output).toBe('0a');
    });

    test('of HexString', () => {
        const output: string = Hex.of('0x61' as string);
        expect(output).toBe('61');
    });

    test('of number', () => {
        const output: string = Hex.of(10 as number);
        expect(output).toBe('0a');

        expect(() => {
            Hex.of(3.14 as number);
        }).toThrow(`Arg 'n' not an integer.`);

        expect(() => {
            Hex.of(-10 as number);
        }).toThrow("Arg 'n' not negative.");
    });

    test('of string', () => {
        const output: string = Hex.of('a' as string);
        expect(output).toBe('61');
    });

    test('of Uint8Array', () => {
        const uint8Array: Uint8Array = new Uint8Array(1);
        uint8Array[0] = 10;
        const output: string = Hex.of(uint8Array);
        expect(output).toBe('0a');
    });

    test('padded', () => {
        const output: string = Hex.of('a', 2);
        expect(output).toBe('0061');
    });
});

/**
 * Text hexadecimal representation of Ethereum quantities.
 * @group unit/utils/hex
 */
describe('Quantity', () => {
    test('of zero', () => {
        const output: string = Quantity.of(0);
        expect(output).toBe('0x0');
    });

    test('of odd long hex expression', () => {
        const output: string = Quantity.of(256);
        expect(output).toBe('0x100');
    });

    test('of even long hex expression', () => {
        const output: string = Quantity.of(255);
        expect(output).toBe('0xff');
    });
});
