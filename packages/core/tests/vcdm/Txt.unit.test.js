"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const util_1 = require("util");
const globals_1 = require("@jest/globals");
const TEXT_ENCODER = new util_1.TextEncoder();
/**
 * Test Txt class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Txt class tests', () => {
    (0, globals_1.describe)('VeChain Data Model tests', () => {
        (0, globals_1.test)('bi getter should throw an error if a decimal value is cast to big integer', () => {
            const txt = src_1.Txt.of('12.3');
            (0, globals_1.expect)(() => txt.bi).toThrow(sdk_errors_1.InvalidOperation);
        });
        (0, globals_1.test)('bi getter should return a BigInt representation of the integer value', () => {
            const txt = src_1.Txt.of('123');
            (0, globals_1.expect)(txt.bi).toBe(BigInt(123));
        });
        (0, globals_1.test)('n getter should return a number representation of the value', () => {
            const txt = src_1.Txt.of('123.5');
            (0, globals_1.expect)(txt.n).toBe(123.5);
        });
        (0, globals_1.test)('bytes getter should return a Uint8Array representation of the value', () => {
            const txt = src_1.Txt.of('abc');
            (0, globals_1.expect)(txt.bytes).toEqual(TEXT_ENCODER.encode('abc'));
        });
        (0, globals_1.test)('compareTo method should correctly compare the instance with another', () => {
            const txt1 = src_1.Txt.of('a');
            const txt2 = src_1.Txt.of('b');
            (0, globals_1.expect)(txt1.compareTo(txt2)).toBe(-1);
        });
        (0, globals_1.test)('isEqual method should correctly check if the instance is equal to another', () => {
            const txt1 = src_1.Txt.of('a');
            const txt2 = src_1.Txt.of('a');
            (0, globals_1.expect)(txt1.isEqual(txt2)).toBe(true);
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Returns a Txt instance if the passed argument is a bigint', () => {
            const txt = src_1.Txt.of(BigInt(123));
            (0, globals_1.expect)(txt.toString()).toBe('123');
        });
        (0, globals_1.test)('Returns a Txt instance if the passed argument is a number', () => {
            const txt = src_1.Txt.of(123);
            (0, globals_1.expect)(txt.toString()).toBe('123');
        });
        (0, globals_1.test)('Returns a Txt instance if the passed argument is a string', () => {
            const txt = src_1.Txt.of('abc');
            (0, globals_1.expect)(txt.toString()).toBe('abc');
        });
        (0, globals_1.test)('Returns a Txt instance if the passed argument is a Uint8Array', () => {
            const txt = src_1.Txt.of(TEXT_ENCODER.encode('abc'));
            (0, globals_1.expect)(txt.toString()).toBe('abc');
        });
    });
    (0, globals_1.describe)('Normalization tests', () => {
        // Using a string with diacritic signs as an example.
        // The 'c' in 'façade' can also be represented using 'c' and '̧' (the cedilla).
        const diacritic = 'fac\u0327ade';
        const normal = 'façade';
        (0, globals_1.test)('Different text encoding should result in different strings', () => {
            // As strings, diacritic 'façade' and normal 'façade' aren't the same.
            (0, globals_1.expect)(diacritic).not.toBe(normal);
        });
        (0, globals_1.test)('Different text encoding should result in equal Txt objects', () => {
            // As Txt objects they are the same because internal NFC normalization.
            // `toEqual` used because `toBe` invokes getter method resulting in exception
            // for `.n` and `.bi` casts because the content is not a number.
            (0, globals_1.expect)(src_1.Txt.of(diacritic)).toEqual(src_1.Txt.of(normal));
        });
        (0, globals_1.test)('Different text encoding should result in equal bytes', () => {
            const expected = src_1.Txt.of(diacritic).bytes;
            (0, globals_1.expect)(expected).toEqual(src_1.Txt.of(normal).bytes);
            // eslint rule test
            // eslint-disable-next-line local-rules/disallow-instanceof-uint8array
            (0, globals_1.expect)(expected instanceof Uint8Array).toBe(true);
        });
    });
});
