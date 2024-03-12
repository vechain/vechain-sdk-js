import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import {
    blockWithMissingTimeStamp,
    blockWithOldTimeStamp,
    blockWithInvalidTimeStampFormat
} from './fixture';
import { InvalidDataTypeError } from '@vechain/sdk-errors';
import { HttpClient, ThorClient } from '../../../src';

/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 *
 */
describe('ThorClient - Nodes Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    /**
     *  @internal
     *  a well-formed URL to ensure we get to the axios call in the node health check
     */
    const URL = 'http://example.com';

    beforeEach(() => {
        const soloNetwork = new HttpClient(URL);
        thorClient = new ThorClient(soloNetwork);
    });

    test('valid URL/node but Error is thrown by network provider', async () => {
        // Mock an error on the HTTPClient
        jest.spyOn(HttpClient.prototype, 'http').mockImplementation(() => {
            throw new Error();
        });

        /**
         *  client required to access a node
         *  @internal
         */

        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError();
    });

    test('valid/available node but invalid block format', async () => {
        // Mock the response to force the JSON response to be null
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce({});

        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidDataTypeError
        );

        // Mock the response to force the JSON response to not be an object
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce({
            invalidKey: 1
        });
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidDataTypeError
        );

        // Mock the response to force the JSON response to have a timestamp non-existent
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithMissingTimeStamp
        );
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidDataTypeError
        );

        // Mock the response to force the JSON response to have a timestamp not a number
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithInvalidTimeStampFormat
        );
        await expect(thorClient.nodes.isHealthy()).rejects.toThrowError(
            InvalidDataTypeError
        );
    });

    test('valid & available node but node is out of sync', async () => {
        // Mock the response to force the JSON response to be out of sync (i.e. > 30 seconds)
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(
            blockWithOldTimeStamp
        );

        await expect(thorClient.nodes.isHealthy()).resolves.toBe(false);
    });
});
