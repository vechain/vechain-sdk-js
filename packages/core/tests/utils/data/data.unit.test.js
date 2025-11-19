"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Hex data tests
 * @group unit/utils-data
 */
(0, globals_1.describe)('dataUtils', () => {
    /**
     * Decode bytes32 string
     */
    (0, globals_1.describe)('decodeBytes32String', () => {
        /**
         * Test cases for decodeBytes32String function.
         */
        fixture_1.decodeBytes32StringTestCases.forEach(({ value, expected }) => {
            (0, globals_1.test)(`should return ${expected} for ${(0, sdk_errors_1.stringifyData)(value)}`, () => {
                (0, globals_1.expect)(src_1.dataUtils.decodeBytes32String(value)).toBe(expected);
            });
        });
        /**
         * Test cases for invalid decodeBytes32String function.
         */
        fixture_1.invalidDecodeBytes32StringTestCases.forEach(({ value, expectedError }) => {
            (0, globals_1.test)(`should throw for ${(0, sdk_errors_1.stringifyData)(value)}`, () => {
                (0, globals_1.expect)(() => src_1.dataUtils.decodeBytes32String(value)).toThrowError(expectedError);
            });
        });
    });
    /**
     * Encode bytes32 string
     */
    (0, globals_1.describe)('encodeBytes32String', () => {
        /**
         * Test cases for encodeBytes32String function.
         */
        fixture_1.encodeBytes32StringTestCases.forEach(({ value, zeroPadding, expected }) => {
            (0, globals_1.test)(`should return ${expected} for ${(0, sdk_errors_1.stringifyData)(value)}`, () => {
                (0, globals_1.expect)(src_1.dataUtils.encodeBytes32String(value, zeroPadding)).toBe(expected);
            });
        });
        /**
         * Test cases for invalid encodeBytes32String function.
         */
        fixture_1.invalidEncodeBytes32StringTestCases.forEach(({ value, zeroPadding, expectedError }) => {
            (0, globals_1.test)(`should throw for ${(0, sdk_errors_1.stringifyData)(value)}`, () => {
                (0, globals_1.expect)(() => src_1.dataUtils.encodeBytes32String(value, zeroPadding)).toThrowError(expectedError);
            });
        });
    });
});
