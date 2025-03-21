import { describe, test } from '@jest/globals';
import { FetchHttpClient, ThorNetworks } from '../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/http/FetchHttpClient.testnet.test.ts'
);

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
                logger.debug(request);
                return request;
            },
            (response: Response) => {
                logger.debug(response);
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
                logger.debug(request);
                return request;
            },
            (response: Response) => {
                logger.debug(response);
                return response;
            }
        ).post({ path: '/post' }, { query: '' }, expected);
        const actual: unknown = await response.json();
        logger.debug(fastJsonStableStringify(actual));
    }, 15000);
});
