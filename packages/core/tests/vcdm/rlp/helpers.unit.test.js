"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const encoding_1 = require("../../../src/vcdm/encoding");
const helpers_fixture_1 = require("./helpers.fixture");
/**
 * Test suite for BigInt helper functions
 * @group unit/numerickind-helpers
 */
(0, globals_1.describe)('encodeBigIntToBuffer', () => {
    (0, globals_1.test)('encodeBigIntToBuffer', () => {
        const bi = 123456789012345678901n; // or any BigInt you want to test with
        const buffer = (0, encoding_1.encodeBigIntToBuffer)(bi, 9, 'encodeBigIntToBuffer');
        (0, globals_1.expect)(src_1.Hex.of(buffer).toString()).toBe('0x06b14e9f812f366c35');
    });
});
/**
 * Test suite for Buffer helper functions
 * @group unit/numerickind-helpers
 */
(0, globals_1.describe)('decodeBufferToHexWithLeadingZeros', () => {
    const buffer = new Uint8Array(1);
    buffer[0] = 10;
    (0, globals_1.test)('decodeBufferToHexWithLeadingZeros zero bytes', () => {
        (0, globals_1.expect)(() => (0, encoding_1.decodeBufferToHexWithLeadingZeros)(buffer, 0)).toThrow(sdk_errors_1.InvalidDataType);
    });
    (0, globals_1.test)('decodeBufferToHexWithLeadingZeros with bytes', () => {
        (0, globals_1.expect)((0, encoding_1.decodeBufferToHexWithLeadingZeros)(buffer, 4)).toBe('0x0000000a');
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
(0, globals_1.describe)('NumericKind helpers', () => {
    /**
     * Test subset for `validateNumericKindData` function.
     *
     * The tests ensure that the function accurately validates and converts numeric
     * input data to BigInt, respecting the rules for numeric kind validity.
     */
    (0, globals_1.describe)('validateNumericKindData', () => {
        /**
         * Tests for valid number input scenarios.
         *
         * This test iterates over cases where the input number is considered valid,
         * asserting that the function successfully returns the expected BigInt.
         */
        helpers_fixture_1.validateNumberTestCases.forEach(({ number, context, expected }) => {
            (0, globals_1.test)(`should return BigInt when data is a valid number ${number}`, () => {
                const result = (0, encoding_1.validateNumericKindData)(number, context);
                // NOTE: Jest doesn't like BigInt. So se use toStrictEqual instead of toBe
                (0, globals_1.expect)(result).toStrictEqual(expected);
            });
        });
        /**
         * Tests for invalid number input scenarios.
         *
         * This test iterates over cases where the input number is considered invalid,
         * asserting that the function throws an error with a corresponding message.
         */
        helpers_fixture_1.invalidNumberTestCases.forEach(({ number, context }) => {
            (0, globals_1.test)(`should throw error when data is invalid ${(0, sdk_errors_1.stringifyData)(number)}`, () => {
                (0, globals_1.expect)(() => {
                    // @ts-expect-error - invalid input
                    (0, encoding_1.validateNumericKindData)(number, context);
                }).toThrowError(sdk_errors_1.InvalidRLP);
            });
        });
    });
    /**
     * Test subset for `assertValidNumericKindBuffer` function.
     *
     * This subset contains tests that validate the function’s ability to
     * ascertain the validity of buffer inputs, based on specific numeric kind rules.
     */
    (0, globals_1.describe)('assertValidNumericKindBuffer', () => {
        /**
         * Tests for valid buffer input scenarios.
         *
         * This test iterates over valid buffer cases, asserting that
         * the function does not throw an error for valid inputs.
         */
        helpers_fixture_1.validNumericBufferTestCases.forEach(({ buffer, context, maxBytes }) => {
            (0, globals_1.test)(`should not throw error when buffer is valid ${src_1.Hex.of(buffer).toString()}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertValidNumericKindBuffer)(buffer, context, maxBytes);
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
        helpers_fixture_1.invalidNumericBufferTestCases.forEach(({ buffer, context, maxBytes }) => {
            (0, globals_1.test)(`should throw error when buffer is invalid ${src_1.Hex.of(buffer).toString()}}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertValidNumericKindBuffer)(buffer, context, maxBytes);
                }).toThrowError(sdk_errors_1.InvalidRLP);
            });
        });
    });
});
/**
 * Test suite for HexBlobKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate hex blob kinds.
 * @group unit/hexblobkind-helpers
 */
(0, globals_1.describe)('HexBlobKind helpers', () => {
    /**
     * Test subset for `assertValidHexBlobKindData` function.
     */
    (0, globals_1.describe)('assertValidHexBlobKindData', () => {
        helpers_fixture_1.validHexBlobKindDataTestCases.forEach(({ data, context }) => {
            (0, globals_1.test)(`should not throw error when data is valid ${data}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertValidHexBlobKindData)(data, context);
                }).not.toThrowError();
            });
        });
        helpers_fixture_1.invalidHexBlobKindDataTestCases.forEach(({ data, context }) => {
            (0, globals_1.test)(`should throw error when data is invalid ${data}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertValidHexBlobKindData)(data, context);
                }).toThrowError(sdk_errors_1.InvalidRLP);
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
(0, globals_1.describe)('FixedHexBlobKind helpers', () => {
    /**
     * Test subset for `assertFixedHexBlobKindData` function.
     */
    (0, globals_1.describe)('assertFixedHexBlobKindData', () => {
        helpers_fixture_1.validFixedHexBlobKindDataTestCases.forEach(({ data, context, bytes }) => {
            (0, globals_1.test)(`should not throw error when data is valid ${data}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertFixedHexBlobKindData)(data, context, bytes);
                }).not.toThrowError();
            });
        });
        helpers_fixture_1.invalidFixedHexBlobKindDataTestCases.forEach(({ data, context, bytes }) => {
            (0, globals_1.test)(`should throw error when data is invalid ${data}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertFixedHexBlobKindData)(data, context, bytes);
                }).toThrowError(sdk_errors_1.InvalidRLP);
            });
        });
    });
    /**
     * Test subset for `assertFixedHexBlobKindBuffer` function.
     */
    (0, globals_1.describe)('assertFixedHexBlobKindBuffer', () => {
        helpers_fixture_1.validFixedHexBlobKindBufferTestCases.forEach(({ buffer, context, bytes }) => {
            (0, globals_1.test)(`should not throw error when buffer is valid ${src_1.Hex.of(buffer).toString()}}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertFixedHexBlobKindBuffer)(buffer, context, bytes);
                }).not.toThrowError();
            });
        });
        helpers_fixture_1.invalidFixedHexBlobKindBufferTestCases.forEach(({ buffer, context, bytes }) => {
            (0, globals_1.test)(`should throw error when buffer is invalid ${(0, sdk_errors_1.stringifyData)(buffer)}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertFixedHexBlobKindBuffer)(buffer, context, bytes);
                }).toThrowError(sdk_errors_1.InvalidRLP);
            });
        });
    });
});
/**
 * Test suite for CompactFixedHexBlobKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate compact fixed hex blob kinds.
 * @group unit/compactfixedhexblobkind-helpers
 */
(0, globals_1.describe)('CompactFixedHexBlobKind helpers', () => {
    (0, globals_1.describe)('assertCompactFixedHexBlobBuffer', () => {
        helpers_fixture_1.validCompactFixedHexBlobKindBufferTestCases.forEach(({ buffer, context, bytes }) => {
            (0, globals_1.test)(`should not throw error when buffer is valid ${src_1.Hex.of(buffer).toString()}}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertCompactFixedHexBlobBuffer)(buffer, context, bytes);
                }).not.toThrowError();
            });
        });
        helpers_fixture_1.invalidCompactFixedHexBlobKindBufferTestCases.forEach(({ buffer, context, bytes }) => {
            (0, globals_1.test)(`should throw error when buffer is invalid ${(0, sdk_errors_1.stringifyData)(buffer)}`, () => {
                (0, globals_1.expect)(() => {
                    (0, encoding_1.assertCompactFixedHexBlobBuffer)(buffer, context, bytes);
                }).toThrowError(sdk_errors_1.InvalidRLP);
            });
        });
    });
});
