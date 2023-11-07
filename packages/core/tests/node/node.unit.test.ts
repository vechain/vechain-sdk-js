import { describe, expect, test, jest } from '@jest/globals';
import { node } from '../../src';
import { HttpClient } from '@vechain-sdk/network/src';
import { blockWithOldTimeStamp } from './fixture';

/**
 * Node unit tests
 * @group unit/node
 */
describe('Unit tests to check the Node health check is working for different scenarios', () => {
    test('null or empty URL or blank URL', async () => {
        await expect(node.isHealthy('')).rejects.toThrowError();
        await expect(node.isHealthy('   ')).rejects.toThrowError();
    });

    test('valid URL/node but Error is thrown by network provide', async () => {
        // Must provide a well-formed URL to ensure we get to the axios call
        const URL = 'http://example.com';

        // TODO: check if spyOn has any disadvantages compared to a mock implementation. It appears easier to use
        jest.spyOn(HttpClient.prototype, 'http').mockImplementation(() => {
            throw new Error();
        });

        await expect(node.isHealthy(URL)).rejects.toThrowError();
    });

    // TODO: mock the response to test for null object repsonse, non object response, timestamp non-existent, timestamp not a number
    test('valid/available node but invalid block format', async () => {});

    test('valid & available node but node is out of sync', async () => {
        // Must provide a well-formed URL to ensure we get to the axios call
        const URL = 'http://example.com';

        // mock the response to force the JSON response to be out of sync (i.e. > 30 seconds)
        // TODO: check if spuOn has any disadvantages compared to a mock implementation. It appears easier to use
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithOldTimeStamp
        );

        await expect(node.isHealthy(URL)).resolves.toBe(false);
    });
});
