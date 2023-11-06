import { describe, expect, test } from '@jest/globals';
import { node } from '../../src';

/**
 * Node unit tests
 * @group unit/node
 */
describe('Unit tests to check the Node health check is working for different scenarios', () => {
    test('valid URL but not an accessible vechain node', async () => {
        await expect(node.isHealthy('www.google.ie')).rejects.toThrowError();
    });

    // TODO:need to mock 'network'?
    test('null or empty URL or blank URL', async () => {
        await expect(node.isHealthy('')).rejects.toThrowError();
        await expect(node.isHealthy(' ')).rejects.toThrowError();
    });

    // TODO: mock the response and move this to a unit test - e.g. test a 500 response
    test('valid URL/node but node is down', async () => {});

    // TODO: mock the response and move this to a unit test to test for null object repsonse, non object response, timestamp non-existent, timestamp not a number
    test('valid/available node but invalid block format', async () => {});

    // TODO: mock the response and move this to a unit test to force the JSON response to be out of sync
    test('valid/available node but node is out of sync', async () => {});
});
