import { describe, expect, test, jest } from '@jest/globals';
import { HttpClient, ThorClient } from '../../../../src';
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
    /**
     *  @internal
     *  a well-formed URL to ensure we get to the axios call in the node health check
     */
    const URL = 'http://example.com';

    test('null or empty URL or blank URL', async () => {
        let thorClient = new ThorClient(new HttpClient(''));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();
        thorClient = new ThorClient(new HttpClient('   '));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();
    });

    test('valid URL/node but Error is thrown by network provide', async () => {
        // Mock an error on the HTTPClient
        jest.spyOn(HttpClient.prototype, 'http').mockImplementation(() => {
            throw new Error();
        });

        /**
         *  client required to access a node
         *  @internal
         */
        const thorClient = new ThorClient(new HttpClient(URL));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();
    });

    test('valid/available node but invalid block format', async () => {
        // Mock the response to force the JSON response to be null
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce({});
        let thorClient = new ThorClient(new HttpClient(URL));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();

        // Mock the response to force the JSON response to not be an object
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce({
            invalidKey: 1
        });
        thorClient = new ThorClient(new HttpClient(URL));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();

        // Mock the response to force the JSON response to have a timestamp non-existent
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithMissingTimeStamp
        );
        thorClient = new ThorClient(new HttpClient(URL));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();

        // Mock the response to force the JSON response to have a timestamp not a number
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithInvalidTimeStampFormat
        );
        thorClient = new ThorClient(new HttpClient(URL));
        await expect(thorClient.node.isHealthy()).rejects.toThrowError();
    });

    test('valid & available node but node is out of sync', async () => {
        // Mock the response to force the JSON response to be out of sync (i.e. > 30 seconds)
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithOldTimeStamp
        );
        const thorClient = new ThorClient(new HttpClient(URL));
        await expect(thorClient.node.isHealthy()).resolves.toBe(false);
    });
});
