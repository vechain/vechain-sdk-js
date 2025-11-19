"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../src");
/**
 * Provider transaction helpers test suite
 *
 * @group unit/helpers/transaction
 */
(0, globals_1.describe)('Provider Transaction Helpers', () => {
    /**
     * Test suite for getTransactionIndex
     */
    (0, globals_1.describe)('getTransactionIndex', () => {
        /**
         * Test cases for getTransactionIndex
         */
        fixture_1.getTransactionIndexTestCases.forEach(({ block, hash, expected }) => {
            (0, globals_1.test)(`should return ${expected} for ${hash}`, () => {
                const idx = (0, src_1.getTransactionIndexIntoBlock)(block, hash);
                (0, globals_1.expect)(idx).toBe(expected);
            });
        });
        /**
         * Test cases for getTransactionIndex with invalid data
         */
        fixture_1.invalidGetTransactionIndexTestCases.forEach(({ block, hash }) => {
            (0, globals_1.test)(`should throw error for ${hash}`, () => {
                (0, globals_1.expect)(() => (0, src_1.getTransactionIndexIntoBlock)(block, hash)).toThrowError(sdk_errors_1.InvalidDataType);
            });
        });
    });
});
