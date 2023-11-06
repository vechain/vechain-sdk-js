import { describe, expect, test } from '@jest/globals';
import { node } from '../../src';

/**
 * Node integration tests
 * @group integration/node
 */
describe('Integration tests to check the Node health check is working for different scenarios', () => {
    const SOLO_NODE_PATH = 'http://localhost:8669';

    test('valid URL but not an accessible vechain node', async () => {
        await expect(node.isHealthy('www.google.ie')).rejects.toThrowError();
    });

    test('invalid URL', async () => {
        await expect(node.isHealthy('INVALID_URL')).rejects.toThrowError();
    });

    test('valid/available node & synchronised node', async () => {
        await expect(node.isHealthy(SOLO_NODE_PATH)).resolves.toBe(true);
    });
});
