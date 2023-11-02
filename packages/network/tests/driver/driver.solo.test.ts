import { describe, expect, test } from '@jest/globals';
import {
    ZERO_ADDRESS,
    soloNetwork,
    testAccount,
    zeroAddressAccountDetails
} from './fixture';
import { type NetParams } from '../../src';

/**
 * SimpleNet class tests
 * @group integration/network
 */
describe('Test SimpleNet class on Solo', () => {
    /**
     * HTTP Request tests
     */
    test('Should perform an HTTP GET request and resolve with response data', async () => {
        const response = await soloNetwork.http(
            'GET',
            `/accounts/${ZERO_ADDRESS}`
        );

        expect(JSON.stringify(response)).toEqual(
            JSON.stringify(zeroAddressAccountDetails)
        );
    });

    /**
     * HTTP Request tests rejecting with an error
     */
    test('Should reject with an error if the HTTP request fails', async () => {
        // Assert that the HTTP request fails with an error
        await expect(
            soloNetwork.http('GET', '/error-test-path')
        ).rejects.toThrowError('404 get /error-test-path: 404 page not found');
    });

    /**
     * Request params validation
     */
    test('Should validate response headers', async () => {
        const customParams: NetParams = {
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
