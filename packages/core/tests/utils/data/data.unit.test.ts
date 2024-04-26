import { describe, expect, test } from '@jest/globals';
import { dataUtils } from '../../../src';
import {
    decodeBytes32StringTestCases,
    encodeBytes32StringTestCases,
    invalidDecodeBytes32StringTestCases,
    invalidEncodeBytes32StringTestCases,
    isNumericTestCases
} from './fixture';

/**
 * Hex data tests
 * @group unit/utils-data
 */
describe('dataUtils', () => {
    /**
     * Decode bytes32 string
     */
    describe('decodeBytes32String', () => {
        /**
         * Test cases for decodeBytes32String function.
         */
        decodeBytes32StringTestCases.forEach(({ value, expected }) => {
            test(`should return ${expected} for ${JSON.stringify(
                value
            )}`, () => {
                expect(dataUtils.decodeBytes32String(value)).toBe(expected);
            });
        });

        /**
         * Test cases for invalid decodeBytes32String function.
         */
        invalidDecodeBytes32StringTestCases.forEach(
            ({ value, expectedError }) => {
                test(`should throw for ${JSON.stringify(value)}`, () => {
                    expect(() =>
                        dataUtils.decodeBytes32String(value)
                    ).toThrowError(expectedError);
                });
            }
        );
    });

    /**
     * Encode bytes32 string
     */
    describe('encodeBytes32String', () => {
        /**
         * Test cases for encodeBytes32String function.
         */
        encodeBytes32StringTestCases.forEach(
            ({ value, zeroPadding, expected }) => {
                test(`should return ${expected} for ${JSON.stringify(
                    value
                )}`, () => {
                    expect(
                        dataUtils.encodeBytes32String(value, zeroPadding)
                    ).toBe(expected);
                });
            }
        );

        /**
         * Test cases for invalid encodeBytes32String function.
         */
        invalidEncodeBytes32StringTestCases.forEach(
            ({ value, zeroPadding, expectedError }) => {
                test(`should throw for ${JSON.stringify(value)}`, () => {
                    expect(() =>
                        dataUtils.encodeBytes32String(value, zeroPadding)
                    ).toThrowError(expectedError);
                });
            }
        );
    });

    /**
     * Verification of numbers in string format
     */
    describe('isNumeric', () => {
        /**
         * Test cases for isNumeric function.
         */
        isNumericTestCases.forEach(({ value, expected }) => {
            test(`should return ${expected} for ${JSON.stringify(
                value
            )}`, () => {
                expect(dataUtils.isNumeric(value)).toBe(expected);
            });
        });
    });

    describe('utf8BytesOf', () => {
        test('utf8BytesOf - convert ASCII characters to correct bytes', () => {
            const text = 'abc';
            const result = dataUtils.utf8BytesOf(text);

            // ASCII 'a' is 97, 'b' is 98, 'c' is 99
            const expected = new Uint8Array([97, 98, 99]);

            expect(result).toEqual(expected);
        });

        test('utf8BytesOf - convert non-ASCII characters - no normalization form provided', () => {
            const text = '𝄢';
            const result = dataUtils.utf8BytesOf(text);

            // 𝄢 in UTF-8 is represented as [0xF0, 0x9D, 0x84, 0xA2]
            const expected = new Uint8Array([0xf0, 0x9d, 0x84, 0xa2]);

            expect(result).toEqual(expected);
        });

        test('utf8BytesOf - convert non-ASCII characters - normalization form provided', () => {
            const text = '𝄢';
            const result = dataUtils.utf8BytesOf(text, 'NFD');

            // This depends on how 𝄢 is normalized. This is just a dummy example.
            const expected = new Uint8Array([0xf0, 0x9d, 0x84, 0xa2]);

            expect(result).toEqual(expected);
        });

        test('utf8BytesOf - valid surrogate pairs', () => {
            const text = '\uD834\uDD1E'; // 𝄞
            const result = dataUtils.utf8BytesOf(text);

            // 𝄞 in UTF-8 is represented as [0xF0, 0x9D, 0x84, 0x9E]
            const expected = new Uint8Array([0xf0, 0x9d, 0x84, 0x9e]);

            expect(result).toEqual(expected);
        });

        test('utf8BytesOf - invalid surrogate pairs', () => {
            // Invalid surrogate pair
            const text = '\uD800\uDBFF';
            expect(() => dataUtils.utf8BytesOf(text)).toThrow();
        });
    });
});
