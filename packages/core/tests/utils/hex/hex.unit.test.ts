import { describe, expect, test } from '@jest/globals';
import { Hex } from '../../../src/utils/hex/Hex';

describe('Hex', () => {
    test('ofBigInt', () => {
        const output = Hex.ofBigInt(BigInt(10), 0);
        expect(output).toBe('0a');

        expect(() => {
            Hex.ofBigInt(BigInt(-10), 0);
        }).toThrow("Arg 'n' not negative.");
    });

    test('ofNumber', () => {
        const output = Hex.ofNumber(10, 0);
        expect(output).toBe('0a');

        expect(() => {
            Hex.ofNumber(3.14, 0);
        }).toThrow(`Arg 'n' not an integer.`);

        expect(() => {
            Hex.ofNumber(-10, 0);
        }).toThrow("Arg 'n' not negative.");
    });

    test('ofBuffer', () => {
        const buffer = new Uint8Array(1);
        buffer[0] = 10;
        const output = Hex.ofBuffer(buffer, 0);
        expect(output).toBe('0a');
    });

    test('ofString', () => {
        const output = Hex.ofString('a', 0);
        expect(output).toBe('61');
    });

    test('of', () => {
        let output = Hex.of(10, 0);
        expect(output).toBe('0a');

        const buffer = new Uint8Array(1);
        buffer[0] = 10;
        output = Hex.of(buffer, 0);
        expect(output).toBe('0a');

        output = Hex.of('a', 0);
        expect(output).toBe('61');
    });

    test('of0x', () => {
        const output = Hex.of0x(10, 0);
        expect(output).toBe('0x0a');
    });
});
