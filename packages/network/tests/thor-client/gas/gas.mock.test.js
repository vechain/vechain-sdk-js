"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const http_1 = require("../../../src/http");
const gas_module_1 = require("../../../src/thor-client/gas/gas-module");
// Create a mock Revision validator
const mockRevisionIsValid = globals_1.jest.fn().mockImplementation((value) => {
    // Accept 'best', 'finalized', numbers, and block IDs (simulated)
    return (value === 'best' ||
        value === 'finalized' ||
        (typeof value === 'number' && value >= 0) ||
        (typeof value === 'string' && value.startsWith('0x')));
});
/**
 * Gas module unit tests with mocks.
 *
 * @group unit/clients/thor-client/gas
 */
(0, globals_1.describe)('GasModule - Unit Tests', () => {
    // GasModule instance and mock HTTP client
    let gasModule;
    let mockHttpClient;
    (0, globals_1.beforeEach)(() => {
        // Reset mocks
        globals_1.jest.clearAllMocks();
        // Create a mock HTTP client with properly typed functions
        mockHttpClient = {
            baseURL: 'http://127.0.0.1:8669',
            http: globals_1.jest.fn().mockReturnValue(Promise.resolve({})),
            get: globals_1.jest.fn().mockReturnValue(Promise.resolve({})),
            post: globals_1.jest.fn().mockReturnValue(Promise.resolve({})),
            put: globals_1.jest.fn().mockReturnValue(Promise.resolve({})),
            delete: globals_1.jest.fn().mockReturnValue(Promise.resolve({}))
        };
        // Create a new GasModule instance with the mock dependencies
        // For testing purposes, we need a type cast but need to follow linter rules
        gasModule = new gas_module_1.GasModule(mockHttpClient);
        // Mock internal methods of GasModule
        // @ts-expect-error - Accessing private property for testing
        gasModule._isValidRevision = mockRevisionIsValid;
    });
    /**
     * Test suite for 'getMaxPriorityFeePerGas' method
     */
    (0, globals_1.describe)('getMaxPriorityFeePerGas', () => {
        (0, globals_1.test)('Should return maxPriorityFeePerGas from a valid response', async () => {
            const mockPriorityFee = '0x9184e72a000'; // 100 Gwei
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.get.mockResolvedValue({
                maxPriorityFeePerGas: mockPriorityFee
            });
            const result = await gasModule.getMaxPriorityFeePerGas();
            (0, globals_1.expect)(result).toBe(mockPriorityFee);
            (0, globals_1.expect)(mockHttpClient.get).toHaveBeenCalledWith('/fees/priority');
        });
        (0, globals_1.test)('Should throw InvalidDataType if response is null', async () => {
            // Mock a null response
            mockHttpClient.get.mockResolvedValue(null);
            await (0, globals_1.expect)(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Should throw InvalidDataType if maxPriorityFeePerGas is missing', async () => {
            // Mock a response with missing maxPriorityFeePerGas
            mockHttpClient.get.mockResolvedValue({
                someOtherField: 'value'
            });
            await (0, globals_1.expect)(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Should throw InvalidDataType if maxPriorityFeePerGas is empty string', async () => {
            // Mock a response with empty maxPriorityFeePerGas
            mockHttpClient.get.mockResolvedValue({
                maxPriorityFeePerGas: ''
            });
            await (0, globals_1.expect)(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Should throw if HTTP request fails', async () => {
            // Mock a failed HTTP request
            mockHttpClient.get.mockRejectedValue(new Error('Network error'));
            await (0, globals_1.expect)(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow();
        });
    });
    /**
     * Test suite for 'getFeeHistory' method
     */
    (0, globals_1.describe)('getFeeHistory', () => {
        const mockFeeHistoryResponse = {
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        };
        (0, globals_1.test)('Should return fee history for valid parameters', async () => {
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.http.mockResolvedValue(mockFeeHistoryResponse);
            const result = await gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 'best', // Using 'best' instead of 'latest'
                rewardPercentiles: [25, 75]
            });
            (0, globals_1.expect)(result).toEqual(mockFeeHistoryResponse);
            // Direct URL check to avoid encoding differences
            (0, globals_1.expect)(mockHttpClient.http).toHaveBeenCalledWith(http_1.HttpMethod.GET, '/fees/history?blockCount=4&newestBlock=best&rewardPercentiles=25%2C75');
        });
        (0, globals_1.test)('Should throw InvalidDataType if blockCount is invalid', async () => {
            await (0, globals_1.expect)(gasModule.getFeeHistory({
                blockCount: 0,
                newestBlock: 'best'
            })).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Should throw InvalidDataType if newestBlock is not valid', async () => {
            // Mock Revision.isValid to return false for this test
            mockRevisionIsValid.mockReturnValueOnce(false);
            await (0, globals_1.expect)(gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 'invalid'
            })).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Should include rewardPercentiles in request when provided', async () => {
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.http.mockResolvedValue(mockFeeHistoryResponse);
            await gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 'best',
                rewardPercentiles: [25, 75]
            });
            (0, globals_1.expect)(mockHttpClient.http).toHaveBeenCalled();
        });
        (0, globals_1.test)('Should throw InvalidDataType if response is null', async () => {
            // Mock a null response
            mockHttpClient.http.mockResolvedValue(null);
            await (0, globals_1.expect)(gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 'best'
            })).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Should handle numeric block number', async () => {
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.http.mockResolvedValue(mockFeeHistoryResponse);
            await gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 12345
            });
            // Direct URL check
            (0, globals_1.expect)(mockHttpClient.http).toHaveBeenCalledWith(http_1.HttpMethod.GET, '/fees/history?blockCount=4&newestBlock=12345');
        });
    });
});
