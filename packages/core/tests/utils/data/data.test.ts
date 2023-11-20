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
});
