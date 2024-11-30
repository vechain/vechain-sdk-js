import { describe, test } from '@jest/globals';
import { FetchHttpClient } from '../src';

describe('FetchHttpClient testnet tests', () => {
    test('ok', async () => {
        await new FetchHttpClient(
            'https://testnet.vechain.org/',
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
