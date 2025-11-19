"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const http_1 = require("../../../src/http");
/**
 * Node integration tests
 * @group integration/clients/thor-client/nodes
 *
 */
(0, globals_1.describe)('ThorClient - Nodes Module', () => {
    // ThorClient instance
    let thorClient;
    /**
     *  @internal
     *  a well-formed URL to ensure we get to the axios call in the node health check
     */
    const URL = 'http://example.com';
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(URL);
    });
    (0, globals_1.test)('valid URL/node but Error is thrown by network provider', async () => {
        // Mock an error on the HTTPClient
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockImplementation(() => {
            throw new Error();
        });
        /**
         *  client required to access a node
         *  @internal
         */
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError();
    });
    (0, globals_1.test)('valid/available node but invalid block format', async () => {
        // Mock the response to force the JSON response to be null
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce({});
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidDataType);
        // Mock the response to force the JSON response to not be an object
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce({
            invalidKey: 1
        });
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidDataType);
        // Mock the response to force the JSON response to have a timestamp non-existent
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(fixture_1.blockWithMissingTimeStamp);
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidDataType);
        // Mock the response to force the JSON response to have a timestamp not a number
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(fixture_1.blockWithInvalidTimeStampFormat);
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).rejects.toThrowError(sdk_errors_1.InvalidDataType);
    });
    (0, globals_1.test)('valid & available node but node is out of sync', async () => {
        // Mock the response to force the JSON response to be out of sync (i.e. > 30 seconds)
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(fixture_1.blockWithOldTimeStamp);
        await (0, globals_1.expect)(thorClient.nodes.isHealthy()).resolves.toBe(false);
    });
});
