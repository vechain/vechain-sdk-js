import { describe, expect, test } from '@jest/globals';
import { InvalidHTTPRequest, stringifyData } from '@vechain/sdk-errors';
import { fail } from 'assert';
import { _HttpClient, type _HttpParams, THOR_SOLO_URL } from '../../../src';
import { testAccount } from '../../fixture';
import { ZERO_ADDRESS, zeroAddressAccountDetails } from './fixture';

/**
 * HttpClient class tests.
 *
 * @group integration/network
 */
describe('Test HttpClient class on Solo node', () => {
    const soloNetwork = new _HttpClient(THOR_SOLO_URL);
    /**
     * HTTP Request tests
     */
    test('Should perform an HTTP GET request and resolve with response data', async () => {
        const response = await soloNetwork.http(
            'GET',
            `/accounts/${ZERO_ADDRESS}`
        );

        expect(stringifyData(response)).toEqual(
            stringifyData(zeroAddressAccountDetails)
        );
    });

    /**
     * HTTP Request tests rejecting with an error (1)
     */
    test('Should reject with an error if the HTTP request fails (1)', async () => {
        // Assert that the HTTP request fails with an error
        try {
            await soloNetwork.http('GET', '/error-test-path');
            fail('should not get here');
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidHTTPRequest);
            if (error instanceof InvalidHTTPRequest) {
                expect(error.message).toBe(
                    `Method 'HttpClient.http()' failed.` +
                        `\n-Reason: 'Request failed with status 404 and message 404 page not found'` +
                        `\n-Parameters: \n\t{\n  "method": "GET",\n  "url": "http://localhost:8669/error-test-path"\n}`
                );
            }
        }
    });
    /**
     * HTTP Request tests rejecting with an error (2)
     */
    test('Should reject with an error if the HTTP request fails (2)', async () => {
        // Assert that the HTTP request fails with an error
        try {
            // Targeting a VeChain network that is not Solo
            await soloNetwork.http('POST', '/transactions', {
                body: {
                    raw: '0xf901854a880104c9cf34b0f5701ef8e7f8e594058d4c951aa24ca012cef3408b259ac1c69d1258890254beb02d1dcc0000b8c469ff936b00000000000000000000000000000000000000000000000000000000ee6c7f95000000000000000000000000167f6cc1e67a615b51b5a2deaba6b9feca7069df000000000000000000000000000000000000000000000000000000000000136a00000000000000000000000000000000000000000000000254beb02d1dcc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080830469978084cb6b32c5c101b88272da83429a49a354f566dd8c85ba288a7c86d1d3161c0aad6a276a7c9f8e69c14df3d76f0d3442a4f4a2a13d016c32c45e82d5010f27386eeb384dee3d8390c0006adead8b8ce8823c583e1ac15facef8f1cc665a707ade82b3c956a53a2b24e0c03d80504bc4b276b5d067b72636d8e88d2ffc65528f868df2cadc716962978a000'
                }
            });
            fail('should not get here');
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidHTTPRequest);
            if (error instanceof InvalidHTTPRequest) {
                expect(error.message).toBe(
                    `Method 'HttpClient.http()' failed.` +
                        `\n-Reason: 'Request failed with status 400 and message bad tx: chain tag mismatch'` +
                        `\n-Parameters: \n\t{\n  "method": "POST",\n  "url": "http://localhost:8669/transactions"\n}`
                );
            }
        }
    });

    /**
     * Request params validation
     */
    test('Should validate response headers', async () => {
        const customParams: _HttpParams = {
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

        // Make an actual HTTP GET request and pass the validateResponseHeaders function
        const response = await soloNetwork.http(
            'GET',
            '/accounts/' + testAccount,
            customParams
        );

        // You can also check the response data if needed
        expect(response).toBeDefined();
    });

    test('Should timeout if request exceeds specified duration', async () => {
        const customTimeout = 100; // 100ms timeout
        const soloNetwork = new _HttpClient(THOR_SOLO_URL, {
            timeout: customTimeout
        });

        // Create a mock server that delays response
        const mockServer = jest.fn().mockImplementation(async () => {
            return await new Promise((resolve) =>
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: async () => await Promise.resolve({})
                    });
                }, customTimeout * 2)
            ); // Delay longer than the timeout
        });

        global.fetch = mockServer as unknown as typeof fetch;

        const start = Date.now();
        await expect(
            soloNetwork.http(
                'GET',
                '/accounts/0x0000000000000000000000000000000000000000'
            )
        ).rejects.toThrow(InvalidHTTPRequest);
        const end = Date.now();

        // Check if the request was aborted close to the timeout time
        expect(end - start).toBeGreaterThanOrEqual(customTimeout);
        expect(end - start).toBeLessThan(customTimeout + 500); // Allow some margin for execution time

        // Verify that fetch was called
        expect(mockServer).toHaveBeenCalled();
    });
});
