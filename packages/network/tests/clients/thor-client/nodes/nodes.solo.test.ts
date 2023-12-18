import {
    describe,
    expect,
    test,
    jest,
    beforeEach,
    afterEach
} from '@jest/globals';
import { HttpClient, type ThorClient } from '../../../../src';
import {
    blockWithMissingTimeStamp,
    blockWithOldTimeStamp,
    blockWithInvalidTimeStampFormat,
    createThorClient
} from './fixture';
import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 *
 */
describe('Integration tests to check the Node health check is working for different scenarios', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = createThorClient(URL);
    });

    afterEach(() => {
        thorClient.destroy();
    });

    /**
     *  @internal
     *  a well-formed URL to ensure we get to the axios call in the node health check
     */
    const URL = 'http://example.com';

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
