import { describe, expect, test } from '@jest/globals';
import {
    ERRORS,
    assertValidNumericKindBuffer,
    validateNumericKindData
} from '../../src';
import {
    invalidNumberTestCases,
    invalidNumericBufferTestCases,
    validNumericBufferTestCases,
    validateNumberTestCases
} from './helpers.fixture';

/**
 * Test suite for NumericKind helpers.
 *
 * This suite contains tests for helper functions meant to validate and manipulate numeric kinds.
 * The numeric kinds are validated both as numbers and buffers, ensuring correctness
 * and throwing errors for invalid inputs.
 */
describe('test NumericKind helpers', () => {
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
        invalidNumberTestCases.forEach(({ number, context, expected }) => {
            test(`should throw error when data is invalid ${JSON.stringify(
                number
            )}`, () => {
                expect(() => {
                    // @ts-expect-error - invalid input
                    validateNumericKindData(number, context);
                }).toThrowError(ERRORS.RLP.INVALID_RLP(context, expected));
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
            test(`should not throw error when buffer is valid ${buffer.toString(
                'hex'
            )}`, () => {
                expect(() => {
                    assertValidNumericKindBuffer(buffer, context, maxBytes);
                }).not.toThrow();
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
            ({ buffer, context, maxBytes, expected }) => {
                test(`should throw error when buffer is invalid ${buffer.toString(
                    'hex'
                )}`, () => {
                    expect(() => {
                        assertValidNumericKindBuffer(buffer, context, maxBytes);
                    }).toThrowError(ERRORS.RLP.INVALID_RLP(context, expected));
                });
            }
        );
    });
});
