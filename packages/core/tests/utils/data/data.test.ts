import { describe, expect, test } from '@jest/globals';
import { dataUtils } from '../../../src';
import {
    decodeBytes32StringTestCases,
    encodeBytes32StringTestCases,
    invalidDecodeBytes32StringTestCases,
    invalidEncodeBytes32StringTestCases,
    invalidHexStrings,
    invalidThorIDs,
    isNumericTestCases,
    prefixedAndUnprefixedStrings,
    validHexStrings,
    validThorIDs
} from './fixture';

/**
 * Hex data tests
 * @group unit/utils-data
 */
describe('utils/hex', () => {
    /**
     * Hex strings conversions
     */
    describe('Hex string conversion', () => {
        test('Should convert string to hex string without prefix by default', () => {
            expect(dataUtils.toHexString('Hello')).toBe('48656c6c6f');
        });

        test('Should convert Uint8Array to hex string without prefix by default', () => {
            expect(
                dataUtils.toHexString(new Uint8Array([72, 101, 108, 108, 111]))
            ).toBe('48656c6c6f');
        });

        test('Should convert string to hex string with prefix when specified', () => {
            expect(dataUtils.toHexString('Hello', { withPrefix: true })).toBe(
                '0x48656c6c6f'
            );
        });

        test('Should convert Uint8Array to hex string with prefix when specified', () => {
            expect(
                dataUtils.toHexString(
                    new Uint8Array([72, 101, 108, 108, 111]),
                    {
                        withPrefix: true
                    }
                )
            ).toBe('0x48656c6c6f');
        });
    });

    /**
     * Hex string verifications
     */
    describe('Hex string verification', () => {
        validHexStrings.forEach((hex) => {
            test(`should return true for valid hex string: ${hex}`, () => {
                expect(dataUtils.isHexString(hex, false)).toBe(true);
            });
        });

        invalidHexStrings.forEach((hex) => {
            test(`should return false for invalid hex string: ${hex}`, () => {
                expect(dataUtils.isHexString(hex, false)).toBe(false);
            });
        });
    });

    /**
     * Thor id verification
     */
    describe('Thor id verification', () => {
        validThorIDs.forEach((id) => {
            test(`Should return true for valid thor id string: ${id.value}`, () => {
                expect(dataUtils.isThorId(id.value, id.checkPrefix)).toBe(true);
            });
        });

        invalidThorIDs.forEach((id) => {
            test(`Should return false for valid thor id string: ${id.value}`, () => {
                expect(dataUtils.isThorId(id.value, id.checkPrefix)).toBe(
                    false
                );
            });
        });
    });

    /**
     * Hex prefixes
     */
    describe('Hex prefix', () => {
        /**
         * Correct removing of "0x" prefix
         */
        test('Should remove "0x" prefix from hex string', () => {
            prefixedAndUnprefixedStrings.forEach((prefixAndUnprefix) => {
                expect(dataUtils.removePrefix(prefixAndUnprefix.prefixed)).toBe(
                    prefixAndUnprefix.unprefixed
                );
            });
        });
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
                // @ts-expect-error - invalid value types are included in test cases
                expect(dataUtils.isNumeric(value)).toBe(expected);
            });
        });
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
     * Pad hex string
     */
    describe('padHexString', () => {
        // Test the default padding length
        test('should pad a hex string to 64 characters by default', () => {
            const result = dataUtils.padHexString('1a');
            expect(result).toHaveLength(66); // 64 chars + '0x'
            expect(result).toBe(
                '0x000000000000000000000000000000000000000000000000000000000000001a'
            );
        });

        // Test padding with custom length
        test('should pad a hex string to a custom length when specified', () => {
            const result = dataUtils.padHexString('1a', 128);
            expect(result).toHaveLength(130); // 128 chars + '0x'
            expect(result).toBe('0x' + '0'.repeat(126) + '1a');
        });

        // Test handling of '0x' prefix
        test('should correctly handle strings already starting with 0x', () => {
            const result = dataUtils.padHexString('0x1a');
            expect(result).toBe(
                '0x000000000000000000000000000000000000000000000000000000000000001a'
            );
        });

        // Test padding a string that is already the correct length
        test('should return the string unchanged if it is already the correct length', () => {
            const hex = '0x' + '1'.repeat(64);
            const result = dataUtils.padHexString(hex);
            expect(result).toBe(hex);
        });

        // Test handling of an empty string
        test('should return a string of just zeros if the input is empty', () => {
            const result = dataUtils.padHexString('');
            expect(result).toBe('0x' + '0'.repeat(64));
        });

        // Test with negative length (should likely throw an error or handle gracefully)
        test('should return the string with the minimum length', () => {
            expect(dataUtils.padHexString('1a', -64)).toBe('0x' + '1a');
        });

        // Test with non-integer length
        test('should handle or throw an error for non-integer length values', () => {
            expect(() => dataUtils.padHexString('1a', 63.5)).toThrow();
        });
    });
});
