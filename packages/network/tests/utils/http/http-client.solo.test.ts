import { describe, expect, test } from '@jest/globals';
import { ZERO_ADDRESS, zeroAddressAccountDetails } from './fixture';
import { HttpClient, type HttpParams } from '../../../src';
import { testAccount } from '../../fixture';
import { HTTPClientError, stringifyData } from '@vechain/sdk-errors';
import { THOR_SOLO_URL } from '@vechain/sdk-constant';

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
        await expect(
            soloNetwork.http('GET', '/error-test-path')
        ).rejects.toThrowError(HTTPClientError);
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
