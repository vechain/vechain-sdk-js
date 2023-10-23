import { describe, expect, test } from '@jest/globals';
import { type AxiosError } from 'axios';
import { convertError } from '../../src';
import { convertErrors } from './fixture';

/**
 * ConvertError function tests.
 * Testing the conversion of our error from AxiosError.
 */
describe('Tests of convertError function', () => {
    /**
     * Convert errors
     */
    convertErrors.forEach(
        (currentConvertError: {
            customAxiosError: AxiosError<unknown, unknown>;
            expected: string;
            testName: string;
        }) => {
            test(currentConvertError.testName, () => {
                // Call the convertError function with the custom AxiosError
                const error = convertError(
                    currentConvertError.customAxiosError
                );

                // Assert that the returned Error message matches the expected format
                expect(error.message).toBe(currentConvertError.expected);
            });
        }
    );
});
