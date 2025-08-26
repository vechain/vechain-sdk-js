import { describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../src';

/**
 * ThorClient module tests.
 *
 * @group unit/clients/thor-client
 */
describe('ThorClient deprecated methods', () => {
    test('ok <- fromUrl', () => {
        const expected = ThorClient.at(TESTNET_URL);

        const actual = ThorClient.at(TESTNET_URL);
        expect(actual.httpClient.baseURL).toEqual(expected.httpClient.baseURL);
    });
});
