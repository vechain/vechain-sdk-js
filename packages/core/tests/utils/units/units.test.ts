import { describe, expect, test } from '@jest/globals';
import {
    formatUnitsTestCases,
    formatVETtestCases,
    invalidFormatUnitsTestCases,
    invalidparseUnitsTestCases,
    parseUnitsTestCases,
    parseVETtestCases
} from './fixture';
import { unitsUtils } from '../../../src';

/**
 * @group unit/utils-units
 */
describe('unitsUtils', () => {
    /**
     * parseUnits tests
     */
    describe('parseUnits', () => {
        /**
         * parseUnits test cases
         */
        parseUnitsTestCases.forEach(
            ({ value, decimals, expected, description }) => {
                test(description, () => {
                    expect(
                        // @ts-expect-error - we are testing also WEI_UNITS
                        unitsUtils.parseUnits(value, decimals).toString()
                    ).toEqual(expected);
                });
            }
        );

        /**
         * invalid parseUnits test cases
         */
        invalidparseUnitsTestCases.forEach(
            ({ value, decimals, expectedError }) => {
                test(`should throw ${expectedError.name} for invalid value: ${value}`, () => {
                    expect(() => {
                        unitsUtils.parseUnits(value, decimals);
                    }).toThrow(expectedError);
                });
            }
        );
    });

    /**
     * formatUnits tests
     */
    describe('formatUnits', () => {
        /**
         * formatUnits test cases for valid values
         * Tests also WEI_UNITS
         */
        formatUnitsTestCases.forEach(
            ({ value, decimals, expected, description }) => {
                test(description, () => {
                    // @ts-expect-error - we are testing also WEI_UNITS
                    expect(unitsUtils.formatUnits(value, decimals)).toEqual(
                        expected
                    );
                });
            }
        );

        /**
         * invalid formatUnits test cases
         */
        invalidFormatUnitsTestCases.forEach(
            ({ value, decimals, expectedError }) => {
                test(`should throw ${expectedError.name} for invalid value: ${value}`, () => {
                    expect(() => {
                        unitsUtils.formatUnits(value, decimals);
                    }).toThrow(expectedError);
                });
            }
        );
    });

    /**
     * parseVET tests
     * parseVET is a wrapper of parseUnits with 18 decimals
     */
    describe('parseVET', () => {
        parseVETtestCases.forEach(({ value, expected }) => {
            test(`should parse ${value} to ${expected}`, () => {
                expect(unitsUtils.parseVET(value).toString()).toEqual(expected);
            });
        });
    });

    /**
     * formatVET tests
     * formatVET is a wrapper of formatUnits with 18 decimals
     */
    describe('formatVET', () => {
        formatVETtestCases.forEach(({ value, expected }) => {
            test(`should format ${value} to ${expected}`, () => {
                expect(unitsUtils.formatVET(value)).toEqual(expected);
            });
        });
    });
});
