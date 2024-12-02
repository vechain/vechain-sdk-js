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
});
