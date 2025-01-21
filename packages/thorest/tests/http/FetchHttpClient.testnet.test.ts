import { describe, test } from '@jest/globals';
import { FetchHttpClient, ThorNetworks } from '../../src';

/**
 * Test FetchHttpClient class.
 *
 * @group integration/network/http
 */
describe('FetchHttpClient testnet tests', () => {
    test('ok <- get', async () => {
        await new FetchHttpClient(
            ThorNetworks.TESTNET,
            (request: Request) => {
                console.log(request);
                return request;
            },
            (response: Response) => {
                console.log(response);
                return response;
            }
        ).get();
    });

    test('ok <- post', async () => {
        const expected = {
            hello: 'world'
        };
        const response = await new FetchHttpClient(
            'https://httpbin.org',
            (request: Request) => {
                console.log(request);
                return request;
            },
            (response: Response) => {
                console.log(response);
                return response;
            }
        ).post({ path: '/post' }, { query: '' }, expected);
        const actual: unknown = await response.json();
        console.log(JSON.stringify(actual, null, 2));
    });
});
