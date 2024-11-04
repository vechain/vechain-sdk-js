import { describe, expect, test } from '@jest/globals';
import { HttpMethod, THOR_SOLO_URL } from '../../src';
import { SimpleHttpClient, type HttpParams } from '../../src/http';
import { InvalidHTTPRequest, stringifyData } from '@vechain/sdk-errors';
import { fail } from 'assert';

const ACCOUNT_SOLO_1 = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

const ACCOUNT_ZERO = '0x0000000000000000000000000000000000000000';

const ACCOUNT_ZERO_DETAILS = {
    balance: '0x0',
    energy: '0x0',
    hasCode: false
};

/**
 * Timeout for each test.
 * Overrides the default timeout of 50000 milliseconds
 * due to cases where the network request takes longer than 5 seconds.
 */
const TIMEOUT = 10000;

/**
 * Test SimpleHttpClient class.
 *
 * @group integration/network
 */
describe('SimpleHttpClient solo tests', () => {
    describe('GET method tests', () => {
        test('404 <- GET not found', async () => {
            try {
                const httpClient = new SimpleHttpClient(THOR_SOLO_URL);
                await httpClient.get(`/invalid/path`);
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidHTTPRequest);
                const innerError = (error as InvalidHTTPRequest).innerError;
                expect(innerError).toBeInstanceOf(Error);
                const cause = (innerError as Error).cause;
                expect(cause).toBeInstanceOf(Response);
                const response = cause as Response;
                expect(response.status).toBe(404);
            }
        });

        test(
            'ok <- GET',
            async () => {
                const httpClient = new SimpleHttpClient(THOR_SOLO_URL);
                const response = await httpClient.get(
                    `/accounts/${ACCOUNT_ZERO}`
                );
                const expected = stringifyData(ACCOUNT_ZERO_DETAILS);
                const actual = stringifyData(response);
                expect(actual).toEqual(expected);
            },
            TIMEOUT
        );

        test('ok <- GET and validate', async () => {
            const params: HttpParams = {
                query: {},
                body: {},
                headers: {
                    'X-Custom-Header': 'custom-value'
                },
                validateResponseHeader: function (
                    headers: Record<string, string>
                ): void {
                    expect(headers).toBeDefined();
                }
            };
            const httpClient = new SimpleHttpClient(THOR_SOLO_URL);
            const response = await httpClient.get(
                `/accounts/${ACCOUNT_SOLO_1}`,
                params
            );
            expect(response).toBeDefined();
        });
    });

    describe('POST method tests', () => {
        test('400 <- POST bad request', async () => {
            try {
                const httpClient = new SimpleHttpClient(THOR_SOLO_URL);
                await httpClient.post('/transactions', {
                    body: {
                        raw: '0xf901854a880104c9cf34b0f5701ef8e7f8e594058d4c951aa24ca012cef3408b259ac1c69d1258890254beb02d1dcc0000b8c469ff936b00000000000000000000000000000000000000000000000000000000ee6c7f95000000000000000000000000167f6cc1e67a615b51b5a2deaba6b9feca7069df000000000000000000000000000000000000000000000000000000000000136a00000000000000000000000000000000000000000000000254beb02d1dcc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080830469978084cb6b32c5c101b88272da83429a49a354f566dd8c85ba288a7c86d1d3161c0aad6a276a7c9f8e69c14df3d76f0d3442a4f4a2a13d016c32c45e82d5010f27386eeb384dee3d8390c0006adead8b8ce8823c583e1ac15facef8f1cc665a707ade82b3c956a53a2b24e0c03d80504bc4b276b5d067b72636d8e88d2ffc65528f868df2cadc716962978a000'
                    }
                });
                fail();
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidHTTPRequest);
                const innerError = (error as InvalidHTTPRequest).innerError;
                expect(innerError).toBeInstanceOf(Error);
                const cause = (innerError as Error).cause;
                expect(cause).toBeInstanceOf(Response);
                const response = cause as Response;
                expect(response.status).toBe(400);
            }
        });
    });

    /*
     NOTE: This test alters `global` context, hence must be the last one.
     */
    test('timeout test - 100 ms', async () => {
        const timeout = 100; // 100ms timeout
        const httpClient = new SimpleHttpClient(THOR_SOLO_URL, timeout);

        // Create a mock server that delays response
        const mockServer = jest.fn().mockImplementation(async () => {
            return await new Promise((resolve) =>
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => ({})
                    });
                }, timeout * 2)
            ); // Delay longer than the timeout
        });

        global.fetch = mockServer as typeof fetch;

        const start = Date.now();
        await expect(
            httpClient.http(HttpMethod.GET, `/accounts/${ACCOUNT_ZERO}`)
        ).rejects.toThrow();
        const end = Date.now();

        // Check if the request was aborted close to the timeout time
        expect(end - start).toBeGreaterThanOrEqual(timeout);
        expect(end - start).toBeLessThan(timeout * 4); // Allow some margin for execution time

        // // Verify that fetch was called
        expect(mockServer).toHaveBeenCalled();
        jest.clearAllMocks();
    });
});
