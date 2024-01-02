import { describe, expect, test } from '@jest/globals';
import {
    invalidSanitizeWebsocketBaseURLTestCases,
    sanitizeWebsocketBaseURLTestCases,
    toQueryStringTestCases
} from './fixture';
import { sanitizeWebsocketBaseURL, toQueryString } from '../../../src';

/**
 * Thorest Helpers test suite
 *
 * @group unit/utils/thorest
 */
describe('Thorest Helpers', () => {
    /**
     * Test the toQueryString function
     */
    toQueryStringTestCases.forEach(({ records, expected }) => {
        test(`toQueryString: ${JSON.stringify(records)}`, () => {
            expect(toQueryString(records)).toEqual(expected);
        });
    });

    /**
     * Test the sanitizeWebsocketBaseURL function
     */
    sanitizeWebsocketBaseURLTestCases.forEach(({ url, expected }) => {
        test(`sanitizeWebsocketBaseURL: ${url}`, () => {
            expect(sanitizeWebsocketBaseURL(url)).toEqual(expected);
        });
    });

    /**
     * Test the sanitizeWebsocketBaseURL function with invalid URLs
     */
    invalidSanitizeWebsocketBaseURLTestCases.forEach(
        ({ url, expectedError }) => {
            test(`sanitizeWebsocketBaseURL: ${url}`, () => {
                expect(() => sanitizeWebsocketBaseURL(url)).toThrow(
                    expectedError
                );
            });
        }
    );
});
