import { describe, expect, test, jest } from '@jest/globals';
import { node } from '../../../src/utils';
import { HttpClient } from '../../../src';
import {
    blockWithMissingTimeStamp,
    blockWithOldTimeStamp,
    blockWithInvalidTimeStampFormat
} from './fixture';

/**
 * Node unit tests
 * @group unit/node
 */
describe('Unit tests to check the Node health check is working for different scenarios', () => {
    // Must provide a well-formed URL to ensure we get to the axios call in the node health check
    const URL = 'http://example.com';

    test('null or empty URL or blank URL', async () => {
        await expect(node.isHealthy('')).rejects.toThrowError();
        await expect(node.isHealthy('   ')).rejects.toThrowError();
    });

    test('valid URL/node but Error is thrown by network provide', async () => {
        // Mock an error on the HTTPClient
        jest.spyOn(HttpClient.prototype, 'http').mockImplementation(() => {
            throw new Error();
        });

        await expect(node.isHealthy(URL)).rejects.toThrowError();
    });

    test('valid/available node but invalid block format', async () => {
        // Mock the response to force the JSON response to be null
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce({});
        await expect(node.isHealthy(URL)).rejects.toThrowError();

        // Mock the response to force the JSON response to not be an object
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce({
            invalidKey: 1
        });
        await expect(node.isHealthy(URL)).rejects.toThrowError();

        // Mock the response to force the JSON response to have a timestamp non-existent
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithMissingTimeStamp
        );
        await expect(node.isHealthy(URL)).rejects.toThrowError();

        // Mock the response to force the JSON response to have a timestamp not a number
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithInvalidTimeStampFormat
        );
        await expect(node.isHealthy(URL)).rejects.toThrowError();
    });

    test('valid & available node but node is out of sync', async () => {
        // Mock the response to force the JSON response to be out of sync (i.e. > 30 seconds)
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithOldTimeStamp
        );

        await expect(node.isHealthy(URL)).resolves.toBe(false);
    });
});
