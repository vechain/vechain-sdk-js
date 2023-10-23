import { describe, expect, test } from '@jest/globals';
import { SimpleNet } from '../src/driver/simple-net';
import { firstTestnetBlock, testnetUrl, testAccount } from './utils/fixture';
import { type NetParams } from '../src/driver/interfaces';

describe('SimpleNet', () => {
    test('Should perform an HTTP GET request and resolve with response data', async () => {
        // Create a new instance of SimpleNet with the testnet URL
        const net = new SimpleNet(testnetUrl);

        // Perform an HTTP GET request using the SimpleNet instance
        const response = await net.http('GET', '/blocks/1?expanded=false');

        // Assert that the response matches the expected firstTestnetBlock
        expect(JSON.stringify(response)).toEqual(
            JSON.stringify(firstTestnetBlock)
        );
    });

    test('Should reject with an error if the HTTP request fails', async () => {
        // Create a new instance of SimpleNet with the testnet URL
        const net = new SimpleNet(testnetUrl);

        // Assert that the HTTP request fails with an error
        await expect(net.http('GET', '/error-test-path')).rejects.toThrow(
            '404 get /error-test-path: 404 page not found'
        );
    });

    test('Should validate response headers', async () => {
        // Create a new instance of SimpleNet with the testnet URL
        const net = new SimpleNet(testnetUrl);

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
        const response = await net.http(
            'GET',
            '/accounts/' + testAccount,
            customParams
        );

        // You can also check the response data if needed
        expect(response).toBeDefined();
    });
});
