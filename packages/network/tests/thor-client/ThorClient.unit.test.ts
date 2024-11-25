import { describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../src';

/**
 * ThorClient module tests.
 */
describe('ThorClient deprecated methods', () => {
    test('ok <- fromUrl', () => {
        const expected = ThorClient.at(TESTNET_URL);
        // eslint-disable-next-line sonarjs/deprecation
        const actual = ThorClient.fromUrl(TESTNET_URL);
        expect(actual.httpClient.baseURL).toEqual(expected.httpClient.baseURL);
    });
});
