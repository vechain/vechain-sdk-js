import { describe, expect } from '@jest/globals';
import { InvalidHTTPRequest } from '@vechain/sdk-errors';
import { SimpleHttpClient } from '../../src';

/**
 * Test SimpleHttpClient class.
 *
 * @group unit/http/client
 */
describe('SimpleHttpClient unit tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('http should work with a valid request', async () => {
        const spied = jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockResolvedValueOnce({
                json: async () => await Promise.resolve({ message: 'ok' }),
                ok: true,
                headers: []
            })
        );
        const client = new SimpleHttpClient('http://localhost/');

        await client.get('/');
        expect(spied).toHaveBeenCalled();
    });
    it('http should return error on invalid req', async () => {
        const response = new Response('ERROR OCCURRED', {
            headers: {},
            status: 400,
            statusText: '400: Bad Request'
        });
        jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockResolvedValueOnce(response)
        );
        const client = new SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            const innerError = (error as InvalidHTTPRequest).innerError;
            expect(innerError).toBeInstanceOf(Error);

            // Check that the error message includes the response body for plain text
            expect((innerError as Error).message).toBe(
                'HTTP 400 400: Bad Request - ERROR OCCURRED'
            );

            const cause = (innerError as Error).cause;
            expect(cause).toBeInstanceOf(Response);
            const response = cause as Response;

            expect(() => response.clone()).not.toThrow();
            const cloned = response.clone();
            const text = await cloned.text();
            expect(text).toBe('ERROR OCCURRED');
        }
    });
    it('http should handle error with empty response body', async () => {
        const response = new Response('', {
            headers: {},
            status: 404,
            statusText: '404: Not Found'
        });
        jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockResolvedValueOnce(response)
        );
        const client = new SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            const innerError = (error as InvalidHTTPRequest).innerError;
            expect(innerError).toBeInstanceOf(Error);

            // Check that the error message doesn't include empty response body
            expect((innerError as Error).message).toBe(
                'HTTP 404 404: Not Found'
            );

            const cause = (innerError as Error).cause;
            expect(cause).toBeInstanceOf(Response);
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
        jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockResolvedValueOnce(response)
        );
        const client = new SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            const innerError = (error as InvalidHTTPRequest).innerError;
            expect(innerError).toBeInstanceOf(Error);

            // Check that the error message includes error code, message, and data
            const errorMessage = (innerError as Error).message;
            expect(errorMessage).toContain('HTTP 400 400: Bad Request');
            expect(errorMessage).toContain('Invalid params');
            expect(errorMessage).toContain('-32602');
            expect(errorMessage).toContain('Transaction format is invalid');

            const cause = (innerError as Error).cause;
            expect(cause).toBeInstanceOf(Response);
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

        jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockResolvedValueOnce(response)
        );

        const client = new SimpleHttpClient('http://localhost/');

        try {
            await client.get('/test');
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidHTTPRequest);

            const innerError = (error as InvalidHTTPRequest).innerError;
            expect(innerError).toBeInstanceOf(Error);

            const errorMessage = (innerError as Error).message;

            // Expect error code, message, and data to be included
            expect(errorMessage).toContain(
                'HTTP 500 500: Internal Server Error'
            );
            expect(errorMessage).toContain('Server error');
            expect(errorMessage).toContain('-32000');
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

            jest.spyOn(globalThis, 'fetch').mockImplementation(
                jest.fn().mockResolvedValueOnce(response)
            );

            const client = new SimpleHttpClient('http://localhost/');

            try {
                await client.get('/test');
                fail(
                    `Should have thrown an error for status ${testCase.status}`
                );
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidHTTPRequest);

                const innerError = (error as InvalidHTTPRequest).innerError;
                expect(innerError).toBeInstanceOf(Error);

                const errorMessage = (innerError as Error).message;

                // Expect specific status code in error message
                expect(errorMessage).toContain(`HTTP ${testCase.status}`);

                // For plain text responses, don't expect response body content
                // Only expect status code and status text
            }
        }
    });
});
