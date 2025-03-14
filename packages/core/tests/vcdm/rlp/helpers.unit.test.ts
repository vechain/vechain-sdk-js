import { describe, expect, test } from '@jest/globals';
import { InvalidRLP, stringifyData } from '@vechain/sdk-errors';
import { Hex, IllegalArgumentError } from '../../../src';
import {
    assertCompactFixedHexBlobBuffer,
    assertFixedHexBlobKindBuffer,
    assertFixedHexBlobKindData,
    assertValidHexBlobKindData,
    assertValidNumericKindBuffer,
    decodeBufferToHexWithLeadingZeros,
    encodeBigIntToBuffer,
    validateNumericKindData
} from '../../../src/vcdm/encoding';
import {
    invalidCompactFixedHexBlobKindBufferTestCases,
    invalidFixedHexBlobKindBufferTestCases,
    invalidFixedHexBlobKindDataTestCases,
    invalidHexBlobKindDataTestCases,
    invalidNumberTestCases,
    invalidNumericBufferTestCases,
    validateNumberTestCases,
    validCompactFixedHexBlobKindBufferTestCases,
    validFixedHexBlobKindBufferTestCases,
    validFixedHexBlobKindDataTestCases,
    validHexBlobKindDataTestCases,
    validNumericBufferTestCases
} from './helpers.fixture';

/**
 * Test suite for BigInt helper functions
 * @group unit/numerickind-helpers
 */
describe('encodeBigIntToBuffer', () => {
    test('encodeBigIntToBuffer', () => {
        const bi = 123456789012345678901n; // or any BigInt you want to test with
        const buffer = encodeBigIntToBuffer(bi, 9, 'encodeBigIntToBuffer');
        expect(Hex.of(buffer).toString()).toBe('0x06b14e9f812f366c35');
    });
});

/**
 * Test suite for Buffer helper functions
 * @group unit/numerickind-helpers
 */
describe('decodeBufferToHexWithLeadingZeros', () => {
    const buffer = new Uint8Array(1);
    buffer[0] = 10;
    test('decodeBufferToHexWithLeadingZeros zero bytes', () => {
        expect(() => decodeBufferToHexWithLeadingZeros(buffer, 0)).toThrow(
            IllegalArgumentError
        );
    });
    test('decodeBufferToHexWithLeadingZeros with bytes', () => {
        expect(decodeBufferToHexWithLeadingZeros(buffer, 4)).toBe('0x0000000a');
    });
});

/**
 * Test suite for NumericKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate numeric kinds.
 * The numeric kinds are validated both as numbers and buffers, ensuring correctness
 * and throwing errors for invalid inputs.
 * @group unit/numerickind-helpers
 */
describe('NumericKind helpers', () => {
    /**
     * Test subset for `validateNumericKindData` function.
     *
     * The tests ensure that the function accurately validates and converts numeric
     * input data to BigInt, respecting the rules for numeric kind validity.
     */
    describe('validateNumericKindData', () => {
        /**
         * Tests for valid number input scenarios.
         *
         * This test iterates over cases where the input number is considered valid,
         * asserting that the function successfully returns the expected BigInt.
         */
        validateNumberTestCases.forEach(({ number, context, expected }) => {
            test(`should return BigInt when data is a valid number ${number}`, () => {
                const result = validateNumericKindData(number, context);
                // NOTE: Jest doesn't like BigInt. So se use toStrictEqual instead of toBe
                expect(result).toStrictEqual(expected);
            });
        });

        /**
         * Tests for invalid number input scenarios.
         *
         * This test iterates over cases where the input number is considered invalid,
         * asserting that the function throws an error with a corresponding message.
         */
        invalidNumberTestCases.forEach(({ number, context }) => {
            test(`should throw error when data is invalid ${stringifyData(
                number
            )}`, () => {
                expect(() => {
                    // @ts-expect-error - invalid input
                    validateNumericKindData(number, context);
                }).toThrowError(InvalidRLP);
            });
        });
    });

    /**
     * Test subset for `assertValidNumericKindBuffer` function.
     *
     * This subset contains tests that validate the function’s ability to
     * ascertain the validity of buffer inputs, based on specific numeric kind rules.
     */
    describe('assertValidNumericKindBuffer', () => {
        /**
         * Tests for valid buffer input scenarios.
         *
         * This test iterates over valid buffer cases, asserting that
         * the function does not throw an error for valid inputs.
         */
        validNumericBufferTestCases.forEach(({ buffer, context, maxBytes }) => {
            test(`should not throw error when buffer is valid ${Hex.of(buffer).toString()}`, () => {
                expect(() => {
                    assertValidNumericKindBuffer(buffer, context, maxBytes);
                }).not.toThrowError();
            });
        });

        /**
         * Tests for invalid buffer input scenarios.
         *
         * This test iterates over invalid buffer cases, asserting that
         * the function throws an error for invalid inputs and the error message
         * aligns with expectations.
         */
        invalidNumericBufferTestCases.forEach(
            ({ buffer, context, maxBytes }) => {
                test(`should throw error when buffer is invalid ${Hex.of(buffer).toString()}}`, () => {
                    expect(() => {
                        assertValidNumericKindBuffer(buffer, context, maxBytes);
                    }).toThrowError(InvalidRLP);
                });
            }
        );
    });
});

/**
 * Test suite for HexBlobKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate hex blob kinds.
 * @group unit/hexblobkind-helpers
 */
describe('HexBlobKind helpers', () => {
    /**
     * Test subset for `assertValidHexBlobKindData` function.
     */
    describe('assertValidHexBlobKindData', () => {
        validHexBlobKindDataTestCases.forEach(({ data, context }) => {
            test(`should not throw error when data is valid ${data}`, () => {
                expect(() => {
                    assertValidHexBlobKindData(data, context);
                }).not.toThrowError();
            });
        });

        invalidHexBlobKindDataTestCases.forEach(({ data, context }) => {
            test(`should throw error when data is invalid ${data}`, () => {
                expect(() => {
                    assertValidHexBlobKindData(data, context);
                }).toThrowError(InvalidRLP);
            });
        });
    });
});

/**
 * Test suite for FixedHexBlobKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate fixed hex blob kinds.
 * @group unit/fixedhexblobkind-helpers
 */
describe('FixedHexBlobKind helpers', () => {
    /**
     * Test subset for `assertFixedHexBlobKindData` function.
     */
    describe('assertFixedHexBlobKindData', () => {
        validFixedHexBlobKindDataTestCases.forEach(
            ({ data, context, bytes }) => {
                test(`should not throw error when data is valid ${data}`, () => {
                    expect(() => {
                        assertFixedHexBlobKindData(data, context, bytes);
                    }).not.toThrowError();
                });
            }
        );

        invalidFixedHexBlobKindDataTestCases.forEach(
            ({ data, context, bytes }) => {
                test(`should throw error when data is invalid ${data}`, () => {
                    expect(() => {
                        assertFixedHexBlobKindData(data, context, bytes);
                    }).toThrowError(InvalidRLP);
                });
            }
        );
    });

    /**
     * Test subset for `assertFixedHexBlobKindBuffer` function.
     */
    describe('assertFixedHexBlobKindBuffer', () => {
        validFixedHexBlobKindBufferTestCases.forEach(
            ({ buffer, context, bytes }) => {
                test(`should not throw error when buffer is valid ${Hex.of(buffer).toString()}}`, () => {
                    expect(() => {
                        assertFixedHexBlobKindBuffer(buffer, context, bytes);
                    }).not.toThrowError();
                });
            }
        );

        invalidFixedHexBlobKindBufferTestCases.forEach(
            ({ buffer, context, bytes }) => {
                test(`should throw error when buffer is invalid ${stringifyData(
                    buffer
                )}`, () => {
                    expect(() => {
                        assertFixedHexBlobKindBuffer(buffer, context, bytes);
                    }).toThrowError(InvalidRLP);
                });
            }
        );
    });
});

/**
 * Test suite for CompactFixedHexBlobKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate compact fixed hex blob kinds.
 * @group unit/compactfixedhexblobkind-helpers
 */
describe('CompactFixedHexBlobKind helpers', () => {
    describe('assertCompactFixedHexBlobBuffer', () => {
        validCompactFixedHexBlobKindBufferTestCases.forEach(
            ({ buffer, context, bytes }) => {
                test(`should not throw error when buffer is valid ${Hex.of(buffer).toString()}}`, () => {
                    expect(() => {
                        assertCompactFixedHexBlobBuffer(buffer, context, bytes);
                    }).not.toThrowError();
                });
            }
        );

        invalidCompactFixedHexBlobKindBufferTestCases.forEach(
            ({ buffer, context, bytes }) => {
                test(`should throw error when buffer is invalid ${stringifyData(
                    buffer
                )}`, () => {
                    expect(() => {
                        assertCompactFixedHexBlobBuffer(buffer, context, bytes);
                    }).toThrowError(InvalidRLP);
                });
            }
        );
    });
});
