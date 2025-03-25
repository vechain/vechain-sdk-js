import { describe, test } from '@jest/globals';
import { FetchHttpClient, ThorNetworks, toURL } from '../../src';

interface HttpBinResponse {
    json: {
        hello: string;
    };
}

/**
 * Test FetchHttpClient class.
 *
 * @group integration/network/http
 */
describe('FetchHttpClient testnet tests', () => {
    test('ok <- get', async () => {
        const response = await new FetchHttpClient(
            toURL(ThorNetworks.TESTNET),
            (request: Request) => {
                console.log(request);
                return request;
            },
            (response: Response) => {
                console.log(response);
                return response;
            }
        ).get();
        expect(response).toBeDefined();
        expect(response.ok).toBe(true);
    });

    test('ok <- post', async () => {
        const expected = {
            hello: 'world'
        } as const;

        const client = new FetchHttpClient(
            new URL('https://httpbin.org'),
            (request: Request) => {
                console.log(request);
                return request;
            },
            (response: Response) => {
                console.log(response);
                return response;
            }
        );

        try {
            const response = await client.post(
                { path: '/post' },
                { query: '' },
                expected
            );

            expect(response.ok).toBe(true);
            const responseData: unknown = await response.json();
            const actual = responseData as HttpBinResponse;
            expect(actual.json.hello).toBe(expected.hello);
        } catch (error) {
            console.error('Post request failed:', error);
            throw error;
        }
    }, 15000); // Increase timeout further to handle slow responses
});
