import { describe, expect, test } from '@jest/globals';
import { node } from '../../../src/utils';
import { soloUrl } from '../../fixture';

/**
 * Node integration tests
 * @group integration/node
 */
describe('Integration tests to check the Node health check is working for different scenarios', () => {
    test('valid URL but not an accessible vechain node', async () => {
        await expect(node.isHealthy('www.google.ie')).rejects.toThrowError();
    });

    test('invalid URL', async () => {
        await expect(node.isHealthy('INVALID_URL')).rejects.toThrowError();
    });

    test('valid/available node & synchronised node', async () => {
        await expect(node.isHealthy(soloUrl)).resolves.toBe(true);
    });
});
