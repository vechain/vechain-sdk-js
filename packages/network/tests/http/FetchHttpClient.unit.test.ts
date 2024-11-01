import { describe, expect, test } from '@jest/globals';
import { HttpMethod, THOR_SOLO_URL } from '../../src';
import { _HttpClient } from './http-client';
import { InvalidHTTPRequest } from '@vechain/sdk-errors';

const ACCOUNT_ZERO = '0x0000000000000000000000000000000000000000';

describe('FetchHttpClient solo tests', () => {
    describe('GET method tests', () => {
        test('timeout <- GET 100 ms', async () => {
            const timeout = 100; // 100ms timeout
            const httpClient = new _HttpClient(THOR_SOLO_URL, {
                timeout
            });
            // const httpClient = new FetchHttpClient(THOR_SOLO_URL, timeout);

            // Create a mock server that delays response
            const mockServer = jest.fn().mockImplementation(async () => {
                return await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            json: async () => await Promise.resolve({})
                        });
                    }, timeout * 2)
                ); // Delay longer than the timeout
            });

            global.fetch = mockServer as typeof fetch;

            const start = Date.now();
            await expect(
                httpClient.http(HttpMethod.GET, `/accounts/${ACCOUNT_ZERO}`)
            ).rejects.toThrow(InvalidHTTPRequest);
            const end = Date.now();

            // Check if the request was aborted close to the timeout time
            expect(end - start).toBeGreaterThanOrEqual(timeout);
            expect(end - start).toBeLessThan(timeout * 4); // Allow some margin for execution time

            // Verify that fetch was called
            expect(mockServer).toHaveBeenCalled();

            jest.clearAllMocks();
        });
    });
});
