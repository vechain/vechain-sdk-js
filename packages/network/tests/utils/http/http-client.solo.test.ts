import { describe, expect, test } from '@jest/globals';
import { InvalidHTTPRequest, stringifyData } from '@vechain/sdk-errors';
import { fail } from 'assert';
import { HttpClient, type HttpParams, THOR_SOLO_URL } from '../../../src';
import { testAccount } from '../../fixture';
import { ZERO_ADDRESS, zeroAddressAccountDetails } from './fixture';

/**
 * HttpClient class tests.
 *
 * @group integration/network
 */
describe('Test HttpClient class on Solo node', () => {
    const soloNetwork = new HttpClient(THOR_SOLO_URL);
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
                        `\n-Reason: 'Invalid URL: http://localhost:8669/error-test-path'` +
                        `\n-Parameters: \n\t{"method":"GET","url":"http://localhost:8669/error-test-path","message":"Request failed"}` +
                        `\n-Internal error: ` +
                        `\n\tMethod 'HttpClient.http()' failed.` +
                        `\n-Reason: 'Invalid URL: http://localhost:8669/error-test-path'` +
                        `\n-Parameters: \n\t{"method":"GET","url":"http://localhost:8669/error-test-path","status":404,"message":"404 page not found\\n"}` +
                        `\n-Internal error: \n\tNo internal error given`
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
            // Targeting testnet
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
                        `\n-Reason: 'Invalid URL: http://localhost:8669/transactions'` +
                        `\n-Parameters: \n\t{"method":"POST","url":"http://localhost:8669/transactions","message":"Request failed"}` +
                        `\n-Internal error: ` +
                        `\n\tMethod 'HttpClient.http()' failed.` +
                        `\n-Reason: 'Invalid URL: http://localhost:8669/transactions'` +
                        `\n-Parameters: \n\t{"method":"POST","url":"http://localhost:8669/transactions","status":400,"message":"bad tx: chain tag mismatch\\n"}` +
                        `\n-Internal error: \n\tNo internal error given`
                );
            }
        }
    });

    /**
     * Request params validation
     */
    test('Should validate response headers', async () => {
        const customParams: HttpParams = {
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
});
