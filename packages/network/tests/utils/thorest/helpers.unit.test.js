"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Thorest Helpers test suite
 *
 * @group unit/utils/thorest
 */
(0, globals_1.describe)('Thorest Helpers', () => {
    /**
     * Test the toQueryString function
     */
    fixture_1.toQueryStringTestCases.forEach(({ records, expected }) => {
        (0, globals_1.test)(`toQueryString: ${(0, sdk_errors_1.stringifyData)(records)}`, () => {
            (0, globals_1.expect)((0, src_1.toQueryString)(records)).toEqual(expected);
        });
    });
    /**
     * Test the sanitizeWebsocketBaseURL function
     */
    fixture_1.sanitizeWebsocketBaseURLTestCases.forEach(({ url, expected }) => {
        (0, globals_1.test)(`sanitizeWebsocketBaseURL: ${url}`, () => {
            (0, globals_1.expect)((0, src_1.sanitizeWebsocketBaseURL)(url)).toEqual(expected);
        });
    });
    /**
     * Test the sanitizeWebsocketBaseURL function with invalid URLs
     */
    fixture_1.invalidSanitizeWebsocketBaseURLTestCases.forEach(({ url, expectedError }) => {
        (0, globals_1.test)(`sanitizeWebsocketBaseURL: ${url}`, () => {
            (0, globals_1.expect)(() => (0, src_1.sanitizeWebsocketBaseURL)(url)).toThrow(expectedError);
        });
    });
});
