import { describe, expect, test } from '@jest/globals';
import { TextEncoder } from 'util';
import { Txt } from '@common/vcdm';
import { UnsupportedOperationError } from '@common/errors';

const TEXT_ENCODER = new TextEncoder();

/**
 * Test Txt class.
 * @group unit/vcdm
 */
describe('Txt class tests', () => {
    describe('VeChain Data Model tests', () => {
        test('bi getter should throw an error if a decimal value is cast to big integer', () => {
            const txt = Txt.of('12.3');
            expect(() => txt.bi).toThrow(UnsupportedOperationError);
        });

        test('bi getter should return a BigInt representation of the integer value', () => {
            const txt = Txt.of('123');
            expect(txt.bi).toBe(BigInt(123));
        });

        test('n getter should return a number representation of the value', () => {
            const txt = Txt.of('123.5');
            expect(txt.n).toBe(123.5);
        });

        test('bytes getter should return a Uint8Array representation of the value', () => {
            const txt = Txt.of('abc');
            expect(txt.bytes).toEqual(TEXT_ENCODER.encode('abc'));
        });

        test('compareTo method should correctly compare the instance with another', () => {
            const txt1 = Txt.of('a');
            const txt2 = Txt.of('b');
            expect(txt1.compareTo(txt2)).toBe(-1);
        });

        test('isEqual method should correctly check if the instance is equal to another', () => {
            const txt1 = Txt.of('a');
            const txt2 = Txt.of('a');
            expect(txt1.isEqual(txt2)).toBe(true);
        });
    });

    describe('Construction tests', () => {
        test('Returns a Txt instance if the passed argument is a bigint', () => {
            const txt = Txt.of(BigInt(123));
            expect(txt.toString()).toBe('123');
        });

        test('Returns a Txt instance if the passed argument is a number', () => {
            const txt = Txt.of(123);
            expect(txt.toString()).toBe('123');
        });

        test('Returns a Txt instance if the passed argument is a string', () => {
            const txt = Txt.of('abc');
            expect(txt.toString()).toBe('abc');
        });

        test('Returns a Txt instance if the passed argument is a Uint8Array', () => {
            const txt = Txt.of(TEXT_ENCODER.encode('abc'));
            expect(txt.toString()).toBe('abc');
        });
    });

    describe('Normalization tests', () => {
        // Using a string with diacritic signs as an example.
        // The 'c' in 'façade' can also be represented using 'c' and '̧' (the cedilla).
        const diacritic = 'fac\u0327ade';
        const normal = 'façade';

        test('Different text encoding should result in different strings', () => {
            // As strings, diacritic 'façade' and normal 'façade' aren't the same.
            expect(diacritic).not.toBe(normal);
        });

        test('Different text encoding should result in equal Txt objects', () => {
            // As Txt objects they are the same because internal NFC normalization.
            // `toEqual` used because `toBe` invokes getter method resulting in exception
            // for `.n` and `.bi` casts because the content is not a number.
            expect(Txt.of(diacritic)).toEqual(Txt.of(normal));
        });

        test('Different text encoding should result in equal bytes', () => {
            const expected = Txt.of(diacritic).bytes;
            expect(expected).toEqual(Txt.of(normal).bytes);

            // eslint rule test
            // eslint-disable-next-line local-rules/disallow-instanceof-uint8array
            expect(expected instanceof Uint8Array).toBe(true);
        });
    });
});
