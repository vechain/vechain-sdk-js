import { jest } from '@jest/globals';
import { type HttpClient, HttpException } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post'
): HttpClient => {
    // Check if response contains error information
    const isError =
        typeof response === 'object' &&
        response !== null &&
        'error' in response;
    const ok = !isError;
    const status = isError ? 400 : 200;
    return {
        [httpMethod]: jest.fn().mockImplementation(async () => {
            // If status is not 200, throw HttpException to simulate FetchHttpClient behavior
            if (status !== 200) {
                throw new HttpException(
                    'MockHttpClient',
                    `HTTP request failed with status ${status}`,
                    status,
                    ok ? 'OK' : 'Bad Request',
                    JSON.stringify(response), // Response body
                    'https://mock-url'
                );
            }

            // For successful responses, return a proper Response object
            const mockResponse = {
                ok: true,
                status: 200,
                statusText: 'OK',
                url: 'https://mock-url',
                json: async () => await Promise.resolve(response satisfies T),
                text: async () =>
                    await Promise.resolve(JSON.stringify(response))
            };

            return mockResponse as unknown as Response;
        })
    } as unknown as HttpClient;
};

// Mock for debug tests that expect JSON directly
const mockHttpClientForDebug = <T>(
    response: T,
    httpMethod: 'get' | 'post'
): HttpClient => {
    // Check if response contains error information
    const isError =
        typeof response === 'object' &&
        response !== null &&
        'error' in response;
    const ok = !isError;
    const status = isError ? 400 : 200;
    return {
        [httpMethod]: jest.fn().mockImplementation(async () => {
            // If status is not 200, throw HttpException to simulate FetchHttpClient behavior
            if (status !== 200) {
                throw new HttpException(
                    'MockHttpClient',
                    `HTTP request failed with status ${status}`,
                    status,
                    ok ? 'OK' : 'Bad Request',
                    JSON.stringify(response), // Response body
                    'https://mock-url'
                );
            }

            // For successful responses, return the JSON directly
            return response as unknown as Response;
        })
    } as unknown as HttpClient;
};

const mockHttpClientWithError = (
    error: string,
    httpMethod: 'get' | 'post'
): HttpClient => {
    // Mock that throws HttpException directly, simulating FetchHttpClient behavior
    return {
        [httpMethod]: jest.fn(async () => {
            throw new HttpException(
                'MockHttpClient',
                `HTTP request failed with status 400`,
                400,
                'Bad Request',
                fastJsonStableStringify(error), // Response body
                'https://mock-url'
            );
        })
    } as unknown as HttpClient;
};

export { mockHttpClient, mockHttpClientForDebug, mockHttpClientWithError };
