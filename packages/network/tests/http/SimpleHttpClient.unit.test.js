"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const SimpleHttpClient_1 = require("../../src/http/SimpleHttpClient");
/**
 * Test SimpleHttpClient class.
 *
 * @group unit/http/client
 */
(0, globals_1.describe)('SimpleHttpClient unit tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('http should work with a valid request', async () => {
        const spied = jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce({
            json: async () => await Promise.resolve({ message: 'ok' }),
            ok: true,
            headers: []
        }));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        await client.get('/');
        (0, globals_1.expect)(spied).toHaveBeenCalled();
    });
    it('http should return error on invalid req', async () => {
        const response = new Response('ERROR OCCURRED', {
            headers: {},
            status: 400,
            statusText: '400: Bad Request'
        });
        jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce(response));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(Error);
            const innerError = error.innerError;
            (0, globals_1.expect)(innerError).toBeInstanceOf(Error);
            // Check that the error message includes the response body for plain text
            (0, globals_1.expect)(innerError.message).toBe('HTTP 400 400: Bad Request - ERROR OCCURRED');
            const cause = innerError.cause;
            (0, globals_1.expect)(cause).toBeInstanceOf(Response);
            const response = cause;
            (0, globals_1.expect)(() => response.clone()).not.toThrow();
            const cloned = response.clone();
            const text = await cloned.text();
            (0, globals_1.expect)(text).toBe('ERROR OCCURRED');
        }
    });
    it('http should throw HttpNetworkError on network failures', async () => {
        // Mock fetch to throw a TypeError (network error according to Fetch API spec)
        jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockRejectedValueOnce(new TypeError('fetch failed')));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
            fail('Should have thrown an error');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.HttpNetworkError);
            const networkError = error;
            (0, globals_1.expect)(networkError.data.method).toBe('GET');
            (0, globals_1.expect)(networkError.data.url).toBe('http://localhost/');
            (0, globals_1.expect)(networkError.data.networkErrorType).toBe('TypeError');
        }
    });
    it('http should throw HttpNetworkError on connection timeout', async () => {
        // Mock fetch to throw a TypeError for connection timeout
        jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockRejectedValueOnce(new TypeError('timeout')));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
            fail('Should have thrown an error');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.HttpNetworkError);
            const networkError = error;
            (0, globals_1.expect)(networkError.data.method).toBe('GET');
            (0, globals_1.expect)(networkError.data.url).toBe('http://localhost/');
            (0, globals_1.expect)(networkError.data.networkErrorType).toBe('TypeError');
        }
    });
    it('http should handle error with empty response body', async () => {
        const response = new Response('', {
            headers: {},
            status: 404,
            statusText: '404: Not Found'
        });
        jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce(response));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(Error);
            const innerError = error.innerError;
            (0, globals_1.expect)(innerError).toBeInstanceOf(Error);
            // Check that the error message doesn't include empty response body
            (0, globals_1.expect)(innerError.message).toBe('HTTP 404 404: Not Found');
            const cause = innerError.cause;
            (0, globals_1.expect)(cause).toBeInstanceOf(Response);
        }
    });
    it('http should include detailed error message from Thor response', async () => {
        const thorErrorResponse = JSON.stringify({
            error: {
                code: -32602,
                message: 'Invalid params',
                data: 'Transaction format is invalid'
            }
        });
        const response = new Response(thorErrorResponse, {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
            statusText: '400: Bad Request'
        });
        jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce(response));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(Error);
            const innerError = error.innerError;
            (0, globals_1.expect)(innerError).toBeInstanceOf(Error);
            // Check that the error message includes error code, message, and data
            const errorMessage = innerError.message;
            (0, globals_1.expect)(errorMessage).toContain('HTTP 400 400: Bad Request');
            (0, globals_1.expect)(errorMessage).toContain('Invalid params');
            (0, globals_1.expect)(errorMessage).toContain('-32602');
            (0, globals_1.expect)(errorMessage).toContain('Transaction format is invalid');
            const cause = innerError.cause;
            (0, globals_1.expect)(cause).toBeInstanceOf(Response);
        }
    });
    it('should handle JSON error responses with complex data gracefully', async () => {
        const jsonErrorResponse = {
            error: {
                code: -32000,
                message: 'Server error',
                data: {
                    reason: 'Database connection failed',
                    retry_after: 30
                }
            }
        };
        const response = new Response(JSON.stringify(jsonErrorResponse), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
            statusText: '500: Internal Server Error'
        });
        jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce(response));
        const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
        try {
            await client.get('/test');
            fail('Should have thrown an error');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.InvalidHTTPRequest);
            const innerError = error.innerError;
            (0, globals_1.expect)(innerError).toBeInstanceOf(Error);
            const errorMessage = innerError.message;
            // Expect error code, message, and data to be included
            (0, globals_1.expect)(errorMessage).toContain('HTTP 500 500: Internal Server Error');
            (0, globals_1.expect)(errorMessage).toContain('Server error');
            (0, globals_1.expect)(errorMessage).toContain('-32000');
            // Note: Data is included if it's a string, not complex nested objects
        }
    });
    it('should handle different HTTP status codes with clean error messages', async () => {
        const testCases = [
            {
                status: 404,
                statusText: '404: Not Found',
                responseBody: '404 page not found'
            },
            {
                status: 429,
                statusText: '429: Too Many Requests',
                responseBody: 'rate limit exceeded'
            },
            {
                status: 500,
                statusText: '500: Internal Server Error',
                responseBody: 'internal server error occurred'
            }
        ];
        for (const testCase of testCases) {
            const response = new Response(testCase.responseBody, {
                headers: {},
                status: testCase.status,
                statusText: testCase.statusText
            });
            jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce(response));
            const client = new SimpleHttpClient_1.SimpleHttpClient('http://localhost/');
            try {
                await client.get('/test');
                fail(`Should have thrown an error for status ${testCase.status}`);
            }
            catch (error) {
                (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.InvalidHTTPRequest);
                const innerError = error.innerError;
                (0, globals_1.expect)(innerError).toBeInstanceOf(Error);
                const errorMessage = innerError.message;
                // Expect specific status code in error message
                (0, globals_1.expect)(errorMessage).toContain(`HTTP ${testCase.status}`);
                // For plain text responses, don't expect response body content
                // Only expect status code and status text
            }
        }
    });
});
