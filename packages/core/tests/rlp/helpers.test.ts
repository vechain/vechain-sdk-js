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

describe('test NumericKind helpers', () => {
    describe('validateNumericKindData', () => {
        validateNumberTestCases.forEach(({ number, context, expected }) => {
            test(`should return BigInt when data is a valid number ${number}`, () => {
                const result = validateNumericKindData(number, context);
                // NOTE: Jest doesn't like BigInt. So se use toStrictEqual instead of toBe
                expect(result).toStrictEqual(expected);
            });
        });

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

    describe('assertValidNumericKindBuffer', () => {
        validNumericBufferTestCases.forEach(({ buffer, context, maxBytes }) => {
            test(`should not throw error when buffer is valid ${buffer.toString(
                'hex'
            )}`, () => {
                expect(() => {
                    assertValidNumericKindBuffer(buffer, context, maxBytes);
                }).not.toThrow();
            });
        });

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
