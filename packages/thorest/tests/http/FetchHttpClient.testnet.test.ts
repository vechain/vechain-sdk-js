import { describe, test } from '@jest/globals';
import { FetchHttpClient, ThorNetworks } from '../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
                log.debug(request);
                return request;
            },
            (response: Response) => {
                log.debug(response);
                return response;
            }
        ).get();
    }, 15000);

    test('ok <- post', async () => {
        const expected = {
            hello: 'world'
        };
        const response = await new FetchHttpClient(
            'https://httpbin.org',
            (request: Request) => {
                log.debug(request);
                return request;
            },
            (response: Response) => {
                log.debug(response);
                return response;
            }
        ).post({ path: '/post' }, { query: '' }, expected);
        const actual: unknown = await response.json();
        log.debug(fastJsonStableStringify(actual));
    }, 15000);
});
