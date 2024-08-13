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
     * HTTP Request tests rejecting with an error
     */
    test('Should reject with an error if the HTTP request fails', async () => {
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
