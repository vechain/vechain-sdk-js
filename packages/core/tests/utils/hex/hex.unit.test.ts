import { describe, expect, test } from '@jest/globals';
import { Hex, ofBuffer } from '../../../src';

/**
 * @group unit/utils/hex
 */
describe('ofBuffer', () => {
    test('ofBuffer for buffer with bytes', () => {
        const buffer: Buffer = Buffer.alloc(1);
        buffer[0] = 10;
        const output: string = ofBuffer(buffer, 4);
        expect(output).toBe('0000000a');
    });
    test('ofBuffer for buffer without bytes', () => {
        const buffer: Buffer = Buffer.alloc(1);
        buffer[0] = 10;
        const output: string = ofBuffer(buffer);
        expect(output).toBe('0a');
    });
    test('ofBuffer for UInt8Array with bytes', () => {
        const buffer: Uint8Array = new Uint8Array(1);
        buffer[0] = 10;
        const output: string = ofBuffer(buffer, 4);
        expect(output).toBe('0000000a');
    });
    test('ofBuffer for UInt8Array without bytes', () => {
        const buffer: Uint8Array = new Uint8Array(1);
        buffer[0] = 10;
        const output: string = ofBuffer(buffer);
        expect(output).toBe('0a');
    });
});

/**
 * @group unit/utils/hex
 */
describe('Hex', () => {
    test('of bigint', () => {
        const output: string = Hex.of(BigInt(10), 0);
        expect(output).toBe('0a');

        expect(() => {
            Hex.of(BigInt(-10), 0);
        }).toThrow("Arg 'n' not negative.");
    });

    test('of buffer', () => {
        const buffer: Uint8Array = new Uint8Array(1);
        buffer[0] = 10;
        const output: string = Hex.of(buffer, 0);
        expect(output).toBe('0a');
    });

    test('of number', () => {
        const output: string = Hex.of(10 as number, 0);
        expect(output).toBe('0a');

        expect(() => {
            Hex.of(3.14 as number, 0);
        }).toThrow(`Arg 'n' not an integer.`);

        expect(() => {
            Hex.of(-10 as number, 0);
        }).toThrow("Arg 'n' not negative.");
    });

    test('of string', () => {
        const output: string = Hex.of('a' as string, 0);
        expect(output).toBe('61');
    });

    test('of0x', () => {
        const output: string = Hex.of0x(10 as number, 0);
        expect(output).toBe('0x0a');
    });

    test('of0x padded', () => {
        const output: string = Hex.of0x(10 as number, 4);
        expect(output).toBe('0x0000000a');
    });

    test('of0x buffer padded', () => {
        const buffer: Buffer = Buffer.alloc(1);
        buffer[0] = 10;
        const output: string = Hex.of0x(buffer, 4);
        expect(output).toBe('0x0000000a');
    });
});
