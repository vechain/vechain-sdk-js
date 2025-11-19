"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("./fixture");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_getLogs' method
 *
 * @group integration/rpc-mapper/methods/eth_getLogs-mock
 */
(0, globals_1.describe)('RPC Mapper - eth_getLogs method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    let mockHttpClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Create a mock HTTP client
        mockHttpClient = {
            baseURL: src_1.THOR_SOLO_URL,
            headers: new Headers(),
            timeout: 10000,
            get: globals_1.jest.fn(),
            post: globals_1.jest.fn(),
            http: globals_1.jest.fn()
        };
        // Create thor client with mock HTTP client
        thorClient = new src_1.ThorClient(mockHttpClient);
    });
    /**
     * eth_getLogs RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_getLogs - Positive cases', () => {
        /**
         * Positive cases. Should be able to get logs
         */
        fixture_1.mockLogsFixture.forEach((fixture, index) => {
            (0, globals_1.test)(`eth_getLogs - Should be able to get logs test - ${index + 1}`, async () => {
                // Mock the HTTP client to return empty logs
                mockHttpClient.http.mockResolvedValue([]);
                // Call RPC method
                const logs = (await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getLogs]([fixture.input])));
                (0, globals_1.expect)(logs.slice(0, 4)).toStrictEqual(fixture.expected);
            }, 15000);
        });
    });
    /**
     * eth_getLogs RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_getLogs - Negative cases', () => {
        /**
         * Negative case 2 - Should throw an error for invalid input if request is invalid
         */
        (0, globals_1.test)('eth_getLogs - Should throw error if request is invalid', async () => {
            // Mock the HTTP client to throw an error
            mockHttpClient.http.mockRejectedValue(new Error('Connection failed'));
            await (0, globals_1.expect)(async () => 
            // Call RPC method
            (await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_getLogs]([fixture_1.logsFixture[0].input])))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
