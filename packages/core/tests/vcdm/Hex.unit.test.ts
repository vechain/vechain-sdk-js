import { Hex, Txt } from '../../src';
import { describe, expect, test } from '@jest/globals';
import { InvalidCastType, InvalidDataType } from '@vechain/sdk-errors';

/**
 * Test Txt class.
 * @group unit/vcdm
 */
describe('Hex class tests', () => {
    describe('VeChain Data Model tests', () => {
        test('Return a bi value from a negative bi expression', () => {
            const exp = -12357n; // From literal.
            const hex = Hex.of(exp);
            expect(hex.bi).toEqual(exp);
        });

        test('Return a bi value from a positive bi expression', () => {
            const exp = BigInt(12357); // From constructor.
            const hex = Hex.of(exp);
            expect(hex.bi).toEqual(exp);
        });

        test('Return a bytes array from a byte UInt8Array', () => {
            const exp = Txt.of('👋🌐');
            const hex = Hex.of(exp.bytes);
            expect(hex.bytes).toEqual(exp.bytes);
            expect(hex.sign).toBeGreaterThan(0);
            expect(Txt.of(hex.bytes).isEqual(exp)).toBeTruthy();
        });

        test('Return a n value for a negative n expression', () => {
            const exp = -123.57;
            const hex = Hex.of(exp);
            expect(hex.n).toEqual(exp);
        });

        test('Return a n value for a positive n expression', () => {
            const exp = 123.57;
            const hex = Hex.of(exp);
            expect(hex.n).toEqual(exp);
        });

        test('Throw an exception casting n from a not IEEE expression', () => {
            const exp = 12357n;
            const hex = Hex.of(exp);
            expect(() => hex.n).toThrow(InvalidCastType);
        });

        test('compareTo method tests - same signs', () => {
            const hex1 = Hex.of('0x123');
            const hex2 = Hex.of('0x456');
            expect(hex1.compareTo(hex2)).toBeLessThan(0);
            expect(hex2.compareTo(hex1)).toBeGreaterThan(0);
            expect(hex1.compareTo(hex1)).toEqual(0);
        });

        test('compareTo method tests - opposite signs', () => {
            const hex1 = Hex.of('-0x123');
            const hex2 = Hex.of('0x123');
            expect(hex1.compareTo(hex2)).toBeLessThan(0);
            expect(hex2.compareTo(hex1)).toBeGreaterThan(0);
        });

        test('isEqual method tests', () => {
            const coffe = Hex.of('0xc0ffe');
            const COFFE = Hex.of('C0FFE');
            const cocoa = Hex.of('c0c0a');
            expect(coffe.isEqual(cocoa)).toBeFalsy();
            expect(coffe.isEqual(COFFE)).toBeTruthy();
        });
    });

    describe('Construction tests', () => {
        test('Return an Hex instance if the passed argument is negative bigint', () => {
            const exp = -12357n;
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.bi).toEqual(exp);
        });

        test('Return an Hex instance if the passed argument is positive bigint', () => {
            const exp = BigInt(12357);
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.bi).toEqual(exp);
        });

        test('Return an Hex instance if the passed argument is negative number', () => {
            const exp = -123.57;
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.n).toEqual(exp);
        });

        test('Return an Hex instance if the passed argument is positive number', () => {
            const exp = 123.57;
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.n).toEqual(exp);
        });

        test('Return an Hex instance if the passed argument is string - with 0x prefix', () => {
            const exp = '0xc0fFeE';
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.toString()).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });

        test('Return an Hex instance if the passed argument is string - without 0x prefix', () => {
            const exp = 'C0c0a';
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.hex).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });

        test('Return an Hex instance if the passed argument is string - negative value with 0x prefix', () => {
            const exp = '-0xc0fFeE';
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.toString()).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });

        test('Return an Hex instance if the passed argument is string - negative value without 0x prefix', () => {
            const exp = '-C0c0a';
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect('-' + hex.hex).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });

        test('Return an Hex instance if the passed argument is an empty string with 0x prefix', () => {
            const exp = '0x';
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.toString()).toEqual(exp);
            expect(hex.hex.length).toEqual(0);
        });

        test('Return an Hex instance if the passed argument is an empty string without 0x prefix', () => {
            const exp = '';
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.toString()).toEqual('0x');
            expect(hex.hex.length).toEqual(0);
        });

        test('Return an Hex instance if the passed argument is UInt8Array', () => {
            const exp = Uint8Array.of(0xc0, 0xff, 0xee);
            const hex = Hex.of(exp);
            expect(hex).toBeInstanceOf(Hex);
            expect(hex.toString()).toEqual('0xc0ffee');
        });

        test('Throw an exception if the passed argument is not an hexadecimal expression', () => {
            const exp = '0xTEA';
            expect(() => Hex.of(exp)).toThrow(InvalidDataType);
        });
    });

    describe('alignToBytes method tests', () => {
        test('Return bytes aligned from aligned expression', () => {
            const hex = Hex.of('0xc0fee');
            const actual = hex.alignToBytes();
            expect(actual.hex.length % 2).toEqual(0);
            // Byte alignment doesn't change hex value.
            expect(actual.isEqual(hex)).toBeTruthy();
        });

        test('Return bytes aligned from unaligned expression', () => {
            const hex = Hex.of('0xc0fe');
            const actual = hex.alignToBytes();
            expect(actual.hex.length % 2).toEqual(0);
            // Byte alignment doesn't change hex value.
            expect(actual.isEqual(hex)).toBeTruthy();
        });
    });

    describe('fit method tests', () => {
        test('Return cut hex', () => {
            const hex = Hex.of('0x000000000000000000000000000caca0');
            const actual = hex.fit(5);
            expect(actual.isEqual(hex)).toBeTruthy();
            // Cut of zeros doesn't change hex value.
            expect(actual.isEqual(hex)).toBeTruthy();
        });

        test('Return padded hex', () => {
            const hex = Hex.of('0xcaca0');
            const actual = hex.fit(32);
            expect(actual.toString()).toEqual(
                '0x000000000000000000000000000caca0'
            );
            // Zero pad doesn't change hex value.
            expect(actual.isEqual(hex)).toBeTruthy();
        });

        test('Throw an exception cutting hex too short', () => {
            const hex = Hex.of('0xcaca0');
            expect(() => hex.fit(4)).toThrow(InvalidDataType);
        });
    });

    describe('isNumber method tests', () => {
        test('Return true for 32 digits hex', () => {
            const exp = '0x00112233445566778899aabbccddeeff';
            const hex = Hex.of(exp);
            expect(hex.isNumber()).toBeTruthy();
        });

        test('Return false for not 32 digits hex', () => {
            const exp = '0xBadBabe';
            const hex = Hex.of(exp);
            expect(hex.isNumber()).toBeFalsy();
        });
    });

    describe('isValid method tests', () => {
        test('Return true for empty input', () => {
            const exp = '';
            expect(Hex.isValid(exp)).toBeTruthy();
        });

        test('Return false for invalid hex', () => {
            const exp = 'G00dB0y';
            expect(Hex.isValid(exp)).toBeFalsy();
        });

        test('Return true for valid negative hex with 0x prefix', () => {
            const exp = '-0xBadBabe';
            expect(Hex.isValid(exp)).toBeTruthy();
        });

        test('Return true for valid negative hex without 0x prefix', () => {
            const exp = '-BadBabe';
            expect(Hex.isValid(exp)).toBeTruthy();
        });

        test('Return true for valid positive hex with 0x prefix', () => {
            const exp = '0xBadBabe';
            expect(Hex.isValid(exp)).toBeTruthy();
        });

        test('Return true for valid positive hex without 0x prefix', () => {
            const exp = 'BadBabe';
            expect(Hex.isValid(exp)).toBeTruthy();
        });
    });

    describe('isValid0x method tests', () => {
        test('Return true for empty input', () => {
            const exp = '0x';
            expect(Hex.isValid(exp)).toBeTruthy();
        });

        test('Return false for invalid hex', () => {
            const exp = '0xG00dB0y';
            expect(Hex.isValid0x(exp)).toBeFalsy();
        });

        test('Return false for valid negative hex without 0x prefix', () => {
            const exp = '-BadBabe';
            expect(Hex.isValid0x(exp)).toBeFalsy();
        });

        test('Return true for valid positive hex with 0x prefix', () => {
            const exp = '-0xBadBabe';
            expect(Hex.isValid0x(exp)).toBeTruthy();
        });

        test('Return false for valid positive hex without 0x prefix', () => {
            const exp = 'BadBabe';
            expect(Hex.isValid0x(exp)).toBeFalsy();
        });

        test('Return true for valid positive hex with 0x prefix', () => {
            const exp = '0xBadBabe';
            expect(Hex.isValid0x(exp)).toBeTruthy();
        });
    });

    describe('random method tests', () => {
        test('Return a random hex with specified number of bytes', () => {
            const bytes = 16;
            const hex = Hex.random(bytes);
            expect(hex.bytes.length).toEqual(bytes);
        });

        test('Throw an exception for zero bytes', () => {
            expect(() => Hex.random(0)).toThrow(InvalidDataType);
        });

        test('Throw an exception with specified negative number of bytes', () => {
            expect(() => Hex.random(0)).toThrow(InvalidDataType);
        });
    });
});
