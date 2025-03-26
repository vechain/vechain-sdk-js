import { describe, expect, test } from '@jest/globals';
import { dataUtils } from '../../../src';
import {
    decodeBytes32StringTestCases,
    encodeBytes32StringTestCases,
    invalidDecodeBytes32StringTestCases,
    invalidEncodeBytes32StringTestCases
} from './fixture';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
            test(`should return ${expected} for ${fastJsonStableStringify(
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
                test(`should throw for ${fastJsonStableStringify(value)}`, () => {
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
                test(`should return ${expected} for ${fastJsonStableStringify(
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
                test(`should throw for ${fastJsonStableStringify(value)}`, () => {
                    expect(() =>
                        dataUtils.encodeBytes32String(value, zeroPadding)
                    ).toThrowError(expectedError);
                });
            }
        );
    });
});
