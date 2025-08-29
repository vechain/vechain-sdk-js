import { describe, expect } from '@jest/globals';
import { InvalidHTTPRequest, HttpNetworkError } from '@vechain/sdk-errors';
import { SimpleHttpClient } from '../../src/http/SimpleHttpClient';

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
            const cause = (innerError as Error).cause;
            expect(cause).toBeInstanceOf(Response);
            const response = cause as Response;

            expect(() => response.clone()).not.toThrow();
            const cloned = response.clone();
            const text = await cloned.text();
            expect(text).toBe('ERROR OCCURRED');
        }
    });

    it('http should throw HttpNetworkError on network failures', async () => {
        // Mock fetch to throw a TypeError (network error according to Fetch API spec)
        jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockRejectedValueOnce(new TypeError('fetch failed'))
        );
        const client = new SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpNetworkError);
            const networkError = error as HttpNetworkError;
            expect(networkError.data.method).toBe('GET');
            expect(networkError.data.url).toBe('http://localhost/');
            expect(networkError.data.networkErrorType).toBe('TypeError');
        }
    });

    it('http should throw HttpNetworkError on connection timeout', async () => {
        // Mock fetch to throw a TypeError for connection timeout
        jest.spyOn(globalThis, 'fetch').mockImplementation(
            jest.fn().mockRejectedValueOnce(new TypeError('timeout'))
        );

        const client = new SimpleHttpClient('http://localhost/');
        try {
            await client.get('/');
            fail('Should have thrown an error');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpNetworkError);
            const networkError = error as HttpNetworkError;
            expect(networkError.data.method).toBe('GET');
            expect(networkError.data.url).toBe('http://localhost/');
            expect(networkError.data.networkErrorType).toBe('TypeError');
        }
    });
});
