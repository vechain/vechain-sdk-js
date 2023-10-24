import { describe, expect, test } from '@jest/globals';
import { type NetParams } from '../../src';
import { firstTestnetBlock, network, testAccount } from './fixture';

/**
 * SimpleNet class tests
 */
describe('Test SimpleNet class', () => {
    /**
     * HTTP Request tests
     */
    test('Should perform an HTTP GET request and resolve with response data', async () => {
        // Perform an HTTP GET request using the SimpleNet instance
        const response = await network.http('GET', '/blocks/1?expanded=false');

        // Assert that the response matches the expected firstTestnetBlock
        expect(JSON.stringify(response)).toEqual(
            JSON.stringify(firstTestnetBlock)
        );
    });

    /**
     * HTTP Request tests rejecting with an error
     */
    test('Should reject with an error if the HTTP request fails', async () => {
        // Assert that the HTTP request fails with an error
        await expect(network.http('GET', '/error-test-path')).rejects.toThrow(
            '404 get /error-test-path: 404 page not found'
        );
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
        const response = await network.http(
            'GET',
            '/accounts/' + testAccount,
            customParams
        );

        // You can also check the response data if needed
        expect(response).toBeDefined();
    });
});
