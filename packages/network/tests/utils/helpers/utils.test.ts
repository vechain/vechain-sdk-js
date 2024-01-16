import { describe, expect, test } from '@jest/globals';
import { type AxiosError } from 'axios';
import { convertErrors } from './fixture';
import { convertError } from '../../../src';

/**
 * ConvertError function tests.
 * Testing the conversion of our error from AxiosError to our error system.
 *
 * @group unit/utils
 */
describe('Tests of convertError function', () => {
    /**
     * Convert errors
     */
    convertErrors.forEach(
        (currentConvertError: {
            customAxiosError: AxiosError<unknown, unknown>;
            testName: string;
        }) => {
            test(currentConvertError.testName, () => {
                // Call the convertError function with the custom AxiosError
                const error = convertError(
                    currentConvertError.customAxiosError
                );

                // Assert that the returned Error has the expected properties
                expect(
                    currentConvertError.customAxiosError.toJSON()
                ).toStrictEqual({});

                // Assert that the returned Error message matches the expected format
                expect(error.message).toBe(
                    'An error occurred while performing http request http://localhost:3000'
                );
                expect(error.code).toBe('INVALID_HTTP_REQUEST');
                expect(error.data).toBeDefined();
                expect(error.data?.status).toBe(
                    currentConvertError.customAxiosError.response?.status
                );
            });
        }
    );
});
