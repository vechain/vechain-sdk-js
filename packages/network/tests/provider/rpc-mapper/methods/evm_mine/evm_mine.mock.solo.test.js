"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'evm_mine' method with Solo Network and mocked functionality
 *
 * @group integration/rpc-mapper/methods/evm_mine
 */
(0, globals_1.describe)('RPC Mapper - evm_mine method tests', () => {
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
     * evm_mine RPC call tests - Positive cases
     */
    (0, globals_1.describe)('evm_mine - Positive cases', () => {
        /**
         * Test case that verifies successful evm_mine call returns null
         */
        (0, globals_1.test)('Should return null when evm_mine succeeds', async () => {
            // Mock the HTTP client to return a block, then a different block (simulating mining)
            mockHttpClient.http
                .mockResolvedValueOnce({ number: 1 }) // First call returns block 1
                .mockResolvedValueOnce({ number: 2 }); // Second call returns block 2 (new block mined)
            const result = await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.evm_mine]([]));
            (0, globals_1.expect)(result).toBeNull();
        });
    });
    /**
     * evm_mine RPC call tests - Negative cases
     */
    (0, globals_1.describe)('evm_mine - Negative cases', () => {
        /**
         * Test case that mocks an error thrown by the getBestBlock method
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` if an error occurs while retrieving the block number', async () => {
            // Mock the HTTP client to throw an error
            mockHttpClient.http.mockRejectedValue(new Error('Connection failed'));
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.evm_mine]([]))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Test case that mocks an error thrown by the waitForBlockCompressed method
         */
        (0, globals_1.test)('Should throw `JSONRPCInternalError` if an error occurs while waiting for the new block', async () => {
            // Mock the HTTP client to return a block first, then throw an error
            mockHttpClient.http
                .mockResolvedValueOnce({ number: 1 }) // First call succeeds
                .mockRejectedValueOnce(new Error('Connection failed')); // Second call fails
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.evm_mine]([]))).resolves.toBeNull();
        });
        /**
         * Should throw JSONRPCInternalError if the best block is null
         */
        (0, globals_1.test)('Should throw JSONRPCInternalError if the best block is null', async () => {
            // Mock the HTTP client to return null (no best block found)
            mockHttpClient.http.mockResolvedValue(null);
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.evm_mine]([]))).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
