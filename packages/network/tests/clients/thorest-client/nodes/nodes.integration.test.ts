import { describe, expect, test } from '@jest/globals';
import { thorSoloClient } from '../../../fixture';
import { HttpClient, ThorClient } from '../../../../src';
import { HTTPClientError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Node integration tests
 * @group integration/node
 */
describe('Integration tests to check the Node health check for different scenarios', () => {
    test('valid URL but inaccessible VeChain node', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = new ThorClient(new HttpClient('www.google.ie'));
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });

    test('invalid URL', async () => {
        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = new ThorClient(new HttpClient('INVALID_URL'));
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });

    test('valid and available synchronized node', async () => {
        const healtyNode = await thorSoloClient.nodes.isHealthy();
        expect(healtyNode).toBe(true);
    });

    test('null or empty URL or blank URL', async () => {
        let thorClient = new ThorClient(new HttpClient(''));
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
        thorClient = new ThorClient(new HttpClient('   '));
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            HTTPClientError
        );
    });
});
