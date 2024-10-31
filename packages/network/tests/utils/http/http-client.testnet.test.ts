import { describe, expect, test } from '@jest/globals';
import { type _HttpParams } from '../../../src';
import { testnetGenesisBlock } from './fixture';
import { testAccount, testNetwork } from '../../fixture';
import { InvalidHTTPRequest, stringifyData } from '@vechain/sdk-errors';

/**
 * Timeout for each test.
 * Overrides the default timeout of 50000 milliseconds
 * due to cases where the network request takes longer than 5 seconds.
 */
const TIMEOUT = 10000;

/**
 * HttpClient class tests.
 *
 * @group integration/network
 */
describe('Test HttpClient class on Testnet', () => {
    /**
     * HTTP Request tests
     */
    test(
        'Should perform an HTTP GET request and resolve with response data',
        async () => {
            // Perform an HTTP GET request using the HttpClient instance
            const response = await testNetwork.http(
                'GET',
                '/blocks/0?expanded=false'
            );

            // Assert that the response matches the expected firstTestnetBlock
            expect(stringifyData(response)).toEqual(
                stringifyData(testnetGenesisBlock)
            );
        },
        TIMEOUT
    );

    /**
     * HTTP Request tests rejecting with an error
     */
    test(
        'Should reject with an error if the HTTP request fails',
        async () => {
            // Assert that the HTTP request fails with an error
            await expect(
                testNetwork.http('GET', '/error-test-path')
            ).rejects.toThrowError(InvalidHTTPRequest);
        },
        TIMEOUT
    );

    /**
     * Request params validation
     */
    test(
        'Should validate response headers',
        async () => {
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
            const response = await testNetwork.http(
                'GET',
                '/accounts/' + testAccount,
                customParams
            );

            // You can also check the response data if needed
            expect(response).toBeDefined();
        },
        TIMEOUT
    );

    /**
     * Request params validation rejecting with an error
     */
    test('Should throw error for invalid header response', async () => {
        const customParams: _HttpParams = {
            query: {},
            body: {},
            headers: {
                'X-Custom-Header': 'custom-value'
            },
            validateResponseHeader: function (): void {
                throw new InvalidHTTPRequest(
                    'validateResponseHeader',
                    'Forcing error on header validation.',
                    { method: 'GET', url: '/accounts/' + testAccount }
                );
            }
        };

        await expect(
            testNetwork.http('GET', '/accounts/' + testAccount, customParams)
        ).rejects.toThrowError(InvalidHTTPRequest);
    });
});
