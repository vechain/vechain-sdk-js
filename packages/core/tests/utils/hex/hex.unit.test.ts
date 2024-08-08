import { describe, expect, test } from '@jest/globals';
import { _Hex, _Hex0x, _Quantity } from '../../../src';
import {
    invalidThorIDs,
    prefixedAndUnprefixedStrings,
    validThorIDs
} from '../data/fixture';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Text Hex representation from TS types prefixed with `0x`.
 * @group unit/utils/hex
 */
describe('Hex0x', () => {
    test('canon - pad to 64 characters by default', () => {
        const result = _Hex0x.canon('1a', 32);
        expect(result).toHaveLength(66); // 64 chars + '0x'
        expect(result).toBe(
            '0x000000000000000000000000000000000000000000000000000000000000001a'
        );
    });

    test('canon - pad to custom length', () => {
        const result = _Hex0x.canon('1a', 64);
        expect(result).toHaveLength(130); // 128 chars + '0x'
        expect(result).toBe('0x' + '0'.repeat(126) + '1a');
    });

    test('canon - with 0x', () => {
        const result = _Hex0x.canon('0x1a', 32);
        expect(result).toBe(
            '0x000000000000000000000000000000000000000000000000000000000000001a'
        );
    });

    test('canon - return unchanged if it is already the correct length', () => {
        const hex = '0x' + '1'.repeat(64);
        const result = _Hex0x.canon(hex, 32);
        expect(result).toBe(hex);
    });

    test('canon - return a string of just zeros if the input is empty', () => {
        const result = _Hex0x.canon('', 32);
        expect(result).toBe('0x' + '0'.repeat(64));
    });

    test('canon - not hex', () => {
        expect(() => _Hex0x.canon('defg', 1)).toThrowError(InvalidDataType);
    });

    test('canon - not fit', () => {
        expect(() => _Hex0x.canon('001a', 1)).toThrowError(InvalidDataType);
    });

    test('canon - non-integer length', () => {
        expect(() => _Hex0x.canon('1a', 31.5)).toThrowError(InvalidDataType);
    });

    test('canon - not positive length', () => {
        expect(() => _Hex0x.canon('1a', -32)).toThrowError(InvalidDataType);
    });

    test('of bigint', () => {
        const output: string = _Hex0x.of(BigInt(10));
        expect(output).toBe('0x0a');
    });

    test('of bigint - padded', () => {
        const output: string = _Hex0x.of(BigInt(10), 2);
        expect(output).toBe('0x000a');
    });

    test('of Buffer', () => {
        const buffer: Uint8Array = Buffer.from(new Uint8Array(1));
        buffer[0] = 10;
        const output: string = _Hex0x.of(buffer);
        expect(output).toBe('0x0a');
    });

    test('of Buffer - padded', () => {
        const buffer: Uint8Array = Buffer.from(new Uint8Array(1));
        buffer[0] = 10;
        const output: string = _Hex0x.of(buffer, 2);
        expect(output).toBe('0x000a');
    });

    test('of Uint8Array', () => {
        const uint8Array: Uint8Array = new Uint8Array(1);
        uint8Array[0] = 10;
        const output: string = _Hex0x.of(uint8Array);
        expect(output).toBe('0x0a');
    });

    test('of Uint8Array - padded', () => {
        const uint8Array: Uint8Array = new Uint8Array(1);
        uint8Array[0] = 10;
        const output: string = _Hex0x.of(uint8Array, 2);
        expect(output).toBe('0x000a');
    });

    test('of number', () => {
        const output: string = _Hex0x.of(10 as number);
        expect(output).toBe('0x0a');
    });

    test('of number', () => {
        const output: string = _Hex0x.of(10 as number, 2);
        expect(output).toBe('0x000a');
    });

    test('of string', () => {
        const output: string = _Hex0x.of('a' as string);
        expect(output).toBe('0x61');
    });

    test('of string', () => {
        const output: string = _Hex0x.of('a' as string, 2);
        expect(output).toBe('0x0061');
    });

    test('isThorId - true', () => {
        validThorIDs.forEach((id) => {
            expect(_Hex0x.isThorId(id.value, !id.checkPrefix)).toBe(true);
        });
    });

    test('isThorId - false', () => {
        invalidThorIDs.forEach((id) => {
            expect(_Hex0x.isThorId(id.value, !id.checkPrefix)).toBe(false);
        });
    });

    test('isValid - true', () => {
        const output: boolean = _Hex0x.isValid('0x12ef');
        expect(output).toBe(true);
    });

    test('isValid - true - optional 0x', () => {
        expect(_Hex0x.isValid('12ef', true)).toBe(true);
        expect(_Hex0x.isValid('0x12ef', true)).toBe(true);
    });

    test('isValid - false - no 0x', () => {
        const output: boolean = _Hex0x.isValid('12ef');
        expect(output).toBe(false);
    });

    test('isValid - false - no hex', () => {
        const output: boolean = _Hex0x.isValid('12fg');
        expect(output).toBe(false);
    });

    test('isValid - false - no hex', () => {
        const output: boolean = _Hex0x.isValid('12fg');
        expect(output).toBe(false);
    });

    test('isValid - false - byte aligned', () => {
        const output: boolean = _Hex0x.isValid('12e', true, true);
        expect(output).toBe(false);
    });

    test('isValid - true - byte aligned', () => {
        const output: boolean = _Hex0x.isValid('12ef', true, true);
        expect(output).toBe(true);
    });
});

/**
 * Text Hex representation from TS types.
 * @group unit/utils/hex
 */
describe('Hex', () => {
    test('canon', () => {
        prefixedAndUnprefixedStrings.forEach((prefixAndUnprefix) => {
            expect(_Hex.canon(prefixAndUnprefix.prefixed)).toBe(
                prefixAndUnprefix.unprefixed
            );
        });
    });

    test('of bigint', () => {
        const output: string = _Hex.of(BigInt(10));
        expect(output).toBe('0a');

        expect(() => {
            _Hex.of(BigInt(-10), 0);
        }).toThrow("Arg 'n' not negative.");
    });

    test('of bigint - padded', () => {
        const output: string = _Hex.of(BigInt(10), 2);
        expect(output).toBe('000a');
    });

    test('of Buffer', () => {
        const buffer: Buffer = Buffer.from(new Uint8Array(1));
        buffer[0] = 10;
        const output: string = _Hex.of(buffer);
        expect(output).toBe('0a');
    });

    test('of Buffer - padded', () => {
        const buffer: Buffer = Buffer.from(new Uint8Array(1));
        buffer[0] = 10;
        const output: string = _Hex.of(buffer, 2);
        expect(output).toBe('000a');
    });

    test('of HexString', () => {
        const output: string = _Hex.of('0x61' as string);
        expect(output).toBe('61');
    });

    test('of HexString - padded', () => {
        const output: string = _Hex.of('0x61' as string, 2);
        expect(output).toBe('0061');
    });

    test('of number', () => {
        const output: string = _Hex.of(10 as number);
        expect(output).toBe('0a');

        expect(() => {
            _Hex.of(3.14 as number);
        }).toThrow(`Arg 'n' not an integer.`);

        expect(() => {
            _Hex.of(-10 as number);
        }).toThrow("Arg 'n' not negative.");
    });

    test('of number - padded', () => {
        const output: string = _Hex.of(10 as number, 2);
        expect(output).toBe('000a');
    });

    test('of string', () => {
        const output: string = _Hex.of('a' as string);
        expect(output).toBe('61');
    });

    test('of string - padded', () => {
        const output: string = _Hex.of('a' as string, 2);
        expect(output).toBe('0061');
    });

    test('of Uint8Array', () => {
        const uint8Array: Uint8Array = new Uint8Array(1);
        uint8Array[0] = 10;
        const output: string = _Hex.of(uint8Array);
        expect(output).toBe('0a');
    });

    test('of Uint8Array - padded', () => {
        const uint8Array: Uint8Array = new Uint8Array(1);
        uint8Array[0] = 10;
        const output: string = _Hex.of(uint8Array);
        expect(output).toBe('0a');
    });

    test('random - should return a string of the correct length', () => {
        const size = 8;
        const hex = _Hex.random(size / 2);
        expect(hex).toHaveLength(size);
    });

    test('random - should only contain hexadecimal characters', () => {
        const size = 8;
        const hex = _Hex.random(size / 2);
        // This regex matches strings that only contain characters 0-9 and a-f
        expect(hex).toMatch(/^[0-9a-f]+$/);
    });

    test('random - should return different values on subsequent calls', () => {
        const size = 8;
        const hex1 = _Hex.random(size / 2);
        const hex2 = _Hex.random(size / 2);
        expect(hex1).not.toEqual(hex2);
    });
});

/**
 * Text hexadecimal representation of Ethereum quantities.
 * @group unit/utils/hex
 */
describe('Quantity', () => {
    test('of zero', () => {
        const output: string = _Quantity.of(0);
        expect(output).toBe('0x0');
    });

    test('of odd long hex expression', () => {
        const output: string = _Quantity.of(256);
        expect(output).toBe('0x100');
    });

    test('of even long hex expression', () => {
        const output: string = _Quantity.of(255);
        expect(output).toBe('0xff');
    });
});
