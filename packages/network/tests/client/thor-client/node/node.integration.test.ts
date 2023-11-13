import { describe, expect, test } from '@jest/globals';
import { thorSoloClient } from '../../../fixture';
import { HttpClient, ThorClient } from '../../../../src';

/**
 * Node integration tests
 * @group integration/node
 */
describe('Integration tests to check the Node health check for different scenarios', () => {
    test('valid URL but inaccessible VeChain node', async () => {
        const thorClient = new ThorClient(new HttpClient('www.google.ie'));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();
    });

    test('invalid URL', async () => {
        const thorClient = new ThorClient(new HttpClient('INVALID_URL'));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();
    });

    test('valid and available synchronized node', async () => {
        await expect(thorSoloClient.node.isHealthy()).resolves.toBe(true);
    });
});
