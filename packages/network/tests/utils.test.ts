import { describe, expect, test } from '@jest/globals';
import { convertError } from '../src/driver/utils/errors';
import { type AxiosError, AxiosHeaders } from 'axios';

describe('convertError', () => {
    type CustomAxiosError = AxiosError<unknown, unknown>;
    test('Should convert AxiosError with response data to Error with data', () => {
        // Create a sample AxiosError with response data
        const headers = new AxiosHeaders();
        const config = {
            url: 'http://localhost:3000',
            headers
        };
        const axiosError: CustomAxiosError = {
            response: {
                status: 200,
                data: { foo: 'bar' },
                statusText: 'ok',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 200'
        };

        // Call the convertError function with the custom AxiosError
        const error = convertError(axiosError);

        // Assert that the returned Error message matches the expected format
        expect(error.message).toBe('200 undefined http://localhost:3000');
    });

    test('Should convert AxiosError without response data to Error with a basic message', () => {
        // Create a sample AxiosError without response data
        const headers = new AxiosHeaders();
        const config = {
            url: 'http://localhost:3000',
            headers
        };

        // Define a custom AxiosError without response data
        const axiosError: CustomAxiosError = {
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 404'
        };

        // Call the convertError function with the custom AxiosError
        const error = convertError(axiosError);

        // Assert that the returned Error message matches the expected format
        expect(error.message).toBe(
            'undefined http://localhost:3000: AxiosError: Request failed with status code 404'
        );
    });

    test('Should convert AxiosError to Error with a basic message', () => {
        // Create a sample AxiosError without a status code
        const headers = new AxiosHeaders();
        const config = {
            url: 'http://localhost:3000',
            headers
        };

        // Define a custom AxiosError without a status code
        const axiosError: CustomAxiosError = {
            response: {
                status: 200,
                data: 'Not found',
                statusText: 'Not Found',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with no status code'
        };

        // Call the convertError function with the custom AxiosError
        const error = convertError(axiosError);

        // Assert that the returned Error message matches the expected format
        expect(error.message).toBe(
            '200 undefined http://localhost:3000: Not found'
        );
    });

    test('Should convert AxiosError with a long response data message', () => {
        // Create a sample AxiosError with a long response data message
        const headers = new AxiosHeaders();
        const config = {
            url: 'http://localhost:3000',
            headers
        };

        // Define a custom AxiosError with a long response data message
        const longData =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(
                20
            );
        const axiosError: CustomAxiosError = {
            response: {
                status: 404,
                data: longData,
                statusText: 'Not Found',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 404'
        };

        // Call the convertError function with the custom AxiosError
        const error = convertError(axiosError);

        // Assert that the returned Error message is truncated and matches the expected format
        expect(error.message).toBe(
            '404 undefined http://localhost:3000: Lorem ipsum dolor sit amet, consectetur adipiscing...'
        );
    });
});
