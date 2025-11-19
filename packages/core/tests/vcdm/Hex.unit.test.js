"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
/**
 * Test Hex class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Hex class tests', () => {
    (0, globals_1.describe)('VeChain Data Model tests', () => {
        (0, globals_1.test)('Return a bi value from a negative bi expression', () => {
            const exp = -12357n; // From literal.
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.bi).toEqual(exp);
        });
        (0, globals_1.test)('Return a bi value from a positive bi expression', () => {
            const exp = BigInt(12357); // From constructor.
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.bi).toEqual(exp);
        });
        (0, globals_1.test)('Return a bytes array from a byte UInt8Array', () => {
            const exp = src_1.Txt.of('👋🌐');
            const hex = src_1.Hex.of(exp.bytes);
            (0, globals_1.expect)(hex.bytes).toEqual(exp.bytes);
            (0, globals_1.expect)(hex.sign).toBeGreaterThan(0);
            (0, globals_1.expect)(src_1.Txt.of(hex.bytes).isEqual(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return a n value for a negative n expression', () => {
            const exp = -123.57;
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.n).toEqual(exp);
        });
        (0, globals_1.test)('Return a n value for a positive n expression', () => {
            const exp = 123.57;
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.n).toEqual(exp);
        });
        (0, globals_1.test)('Throw an exception casting n from a not IEEE expression', () => {
            const exp = 12357n;
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(() => hex.n).toThrow(sdk_errors_1.InvalidOperation);
        });
        (0, globals_1.test)('compareTo method tests - same signs', () => {
            const hex1 = src_1.Hex.of('0x123');
            const hex2 = src_1.Hex.of('0x456');
            (0, globals_1.expect)(hex1.compareTo(hex2)).toBeLessThan(0);
            (0, globals_1.expect)(hex2.compareTo(hex1)).toBeGreaterThan(0);
            (0, globals_1.expect)(hex1.compareTo(hex1)).toEqual(0);
        });
        (0, globals_1.test)('compareTo method tests - opposite signs', () => {
            const hex1 = src_1.Hex.of('-0x123');
            const hex2 = src_1.Hex.of('0x123');
            (0, globals_1.expect)(hex1.compareTo(hex2)).toBeLessThan(0);
            (0, globals_1.expect)(hex2.compareTo(hex1)).toBeGreaterThan(0);
        });
        (0, globals_1.test)('isEqual method tests', () => {
            const coffe = src_1.Hex.of('0xc0ffe');
            const COFFE = src_1.Hex.of('C0FFE');
            const cocoa = src_1.Hex.of('c0c0a');
            (0, globals_1.expect)(coffe.isEqual(cocoa)).toBeFalsy();
            (0, globals_1.expect)(coffe.isEqual(COFFE)).toBeTruthy();
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return an Hex instance if the passed argument is negative bigint', () => {
            const exp = -12357n;
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.bi).toEqual(exp);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is positive bigint', () => {
            const exp = BigInt(12357);
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.bi).toEqual(exp);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is negative number', () => {
            const exp = -123.57;
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.n).toEqual(exp);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is positive number', () => {
            const exp = 123.57;
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.n).toEqual(exp);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is string - with 0x prefix', () => {
            const exp = '0xc0fFeE';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.toString()).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is string - without 0x prefix', () => {
            const exp = 'C0c0a';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.digits).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is string - negative value with 0x prefix', () => {
            const exp = '-0xc0fFeE';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.toString()).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });
        (0, globals_1.test)('Return a compact string representation of the Hex instance', () => {
            const exp = BigInt(10000000000000); // Base gas price for legacy transactions
            const expectedHexString = '0x09184e72a000';
            const expectedCompactHexString = '0x9184e72a000';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.toString()).toEqual(expectedHexString);
            (0, globals_1.expect)(hex.toString(true)).toEqual(expectedCompactHexString);
            const expectedZeroHexString = '0x00000000000000000000000000000000';
            const expectedCompactZeroHexString = '0x0';
            const zeroHex = src_1.Hex.of(0);
            (0, globals_1.expect)(zeroHex.toString(true)).toEqual(expectedCompactZeroHexString);
            (0, globals_1.expect)(zeroHex.toString()).toEqual(expectedZeroHexString);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is string - negative value without 0x prefix', () => {
            const exp = '-C0c0a';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)('-' + hex.digits).toEqual(exp.toLowerCase()); // Normalized from is lower case.
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is an empty string with 0x prefix', () => {
            const exp = '0x';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.toString()).toEqual(exp);
            (0, globals_1.expect)(hex.digits.length).toEqual(0);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is an empty string without 0x prefix', () => {
            const exp = '';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.toString()).toEqual('0x');
            (0, globals_1.expect)(hex.digits.length).toEqual(0);
        });
        (0, globals_1.test)('Return an Hex instance if the passed argument is UInt8Array', () => {
            const exp = Uint8Array.of(0xc0, 0xff, 0xee);
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex).toBeInstanceOf(src_1.Hex);
            (0, globals_1.expect)(hex.toString()).toEqual('0xc0ffee');
        });
        (0, globals_1.test)('Throw an exception if the passed argument is not an hexadecimal expression', () => {
            const exp = '0xTEA';
            (0, globals_1.expect)(() => src_1.Hex.of(exp)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('abs property test', () => {
        (0, globals_1.test)('Return a positive Hex instance for a negative argument', () => {
            const exp = '-0xA01fe';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.abs.isEqual(src_1.Hex.of(exp.slice(1)))).toBeTruthy();
        });
        (0, globals_1.test)('Return a positive Hex instance for a positive argument', () => {
            const exp = '0xA01fe';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.abs.isEqual(hex)).toBeTruthy();
        });
    });
    (0, globals_1.describe)('alignToBytes method tests', () => {
        (0, globals_1.test)('Return bytes aligned from aligned expression', () => {
            const hex = src_1.Hex.of('0xc0fee');
            const actual = hex.alignToBytes();
            (0, globals_1.expect)(actual.digits.length % 2).toEqual(0);
            // Byte alignment doesn't change hex value.
            (0, globals_1.expect)(actual.isEqual(hex)).toBeTruthy();
        });
        (0, globals_1.test)('Return bytes aligned from unaligned expression', () => {
            const hex = src_1.Hex.of('0xc0fe');
            const actual = hex.alignToBytes();
            (0, globals_1.expect)(actual.digits.length % 2).toEqual(0);
            // Byte alignment doesn't change hex value.
            (0, globals_1.expect)(actual.isEqual(hex)).toBeTruthy();
        });
    });
    (0, globals_1.describe)('fit method tests', () => {
        (0, globals_1.test)('Return cut hex', () => {
            const hex = src_1.Hex.of('0x000000000000000000000000000caca0');
            const actual = hex.fit(5);
            (0, globals_1.expect)(actual.isEqual(hex)).toBeTruthy();
            // Cut of zeros doesn't change hex value.
            (0, globals_1.expect)(actual.isEqual(hex)).toBeTruthy();
        });
        (0, globals_1.test)('Return padded hex', () => {
            const hex = src_1.Hex.of('0xcaca0');
            const actual = hex.fit(32);
            (0, globals_1.expect)(actual.toString()).toEqual('0x000000000000000000000000000caca0');
            // Zero pad doesn't change hex value.
            (0, globals_1.expect)(actual.isEqual(hex)).toBeTruthy();
        });
        (0, globals_1.test)('Throw an exception cutting hex too short', () => {
            const hex = src_1.Hex.of('0xcaca0');
            (0, globals_1.expect)(() => hex.fit(4)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('isNumber method tests', () => {
        (0, globals_1.test)('Return true for 32 digits hex', () => {
            const exp = '0x00112233445566778899aabbccddeeff';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.isNumber()).toBeTruthy();
        });
        (0, globals_1.test)('Return false for not 32 digits hex', () => {
            const exp = '0xBadBabe';
            const hex = src_1.Hex.of(exp);
            (0, globals_1.expect)(hex.isNumber()).toBeFalsy();
        });
    });
    (0, globals_1.describe)('isValid method tests', () => {
        (0, globals_1.test)('Return true for empty input', () => {
            const exp = '';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return false for invalid hex', () => {
            const exp = 'G00dB0y';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeFalsy();
        });
        (0, globals_1.test)('Return true for valid negative hex with 0x prefix', () => {
            const exp = '-0xBadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return true for valid negative hex without 0x prefix', () => {
            const exp = '-BadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return true for valid positive hex with 0x prefix', () => {
            const exp = '0xBadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return true for valid positive hex without 0x prefix', () => {
            const exp = 'BadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeTruthy();
        });
    });
    (0, globals_1.describe)('isValid0x method tests', () => {
        (0, globals_1.test)('Return true for empty input', () => {
            const exp = '0x';
            (0, globals_1.expect)(src_1.Hex.isValid(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return false for invalid hex', () => {
            const exp = '0xG00dB0y';
            (0, globals_1.expect)(src_1.Hex.isValid0x(exp)).toBeFalsy();
        });
        (0, globals_1.test)('Return false for valid negative hex without 0x prefix', () => {
            const exp = '-BadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid0x(exp)).toBeFalsy();
        });
        (0, globals_1.test)('Return true for valid positive hex with 0x prefix', () => {
            const exp = '-0xBadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid0x(exp)).toBeTruthy();
        });
        (0, globals_1.test)('Return false for valid positive hex without 0x prefix', () => {
            const exp = 'BadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid0x(exp)).toBeFalsy();
        });
        (0, globals_1.test)('Return true for valid positive hex with 0x prefix', () => {
            const exp = '0xBadBabe';
            (0, globals_1.expect)(src_1.Hex.isValid0x(exp)).toBeTruthy();
        });
    });
    (0, globals_1.describe)('Polymorphism equivalence', () => {
        (0, globals_1.test)('Equal for bigint, bytes, hex expression', () => {
            const ofBi = src_1.Hex.of(255n);
            const ofBytes = src_1.Hex.of(Uint8Array.of(255));
            const ofHex = src_1.Hex.of('0xff');
            (0, globals_1.expect)(ofBi.isEqual(ofBytes)).toBeTruthy();
            (0, globals_1.expect)(ofBytes.isEqual(ofHex)).toBeTruthy();
        });
        (0, globals_1.test)('Not equal for bigint, bytes, hex expression and number expression (IEEE 745)', () => {
            const ofBi = src_1.Hex.of(255n);
            const ofN = src_1.Hex.of(255);
            (0, globals_1.expect)(ofBi.isEqual(ofN)).toBeFalsy();
        });
    });
    (0, globals_1.describe)('random method tests', () => {
        (0, globals_1.test)('Return a random hex with specified number of bytes', () => {
            const bytes = 16;
            const hex = src_1.Hex.random(bytes);
            (0, globals_1.expect)(hex.bytes.length).toEqual(bytes);
        });
        (0, globals_1.test)('Throw an exception for zero bytes', () => {
            (0, globals_1.expect)(() => src_1.Hex.random(0)).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw an exception with specified negative number of bytes', () => {
            (0, globals_1.expect)(() => src_1.Hex.random(0)).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
});
