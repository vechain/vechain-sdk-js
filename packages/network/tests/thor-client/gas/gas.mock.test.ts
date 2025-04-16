import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { type HttpClient, HttpMethod } from '../../../src/http';
import { GasModule } from '../../../src/thor-client/gas/gas-module';

// Create a mock Revision validator
const mockRevisionIsValid = jest.fn().mockImplementation((value) => {
    // Accept 'best', 'finalized', numbers, and block IDs (simulated)
    return (
        value === 'best' ||
        value === 'finalized' ||
        (typeof value === 'number' && value >= 0) ||
        (typeof value === 'string' && value.startsWith('0x'))
    );
});

/**
 * Gas module unit tests with mocks.
 *
 * @group unit/clients/thor-client/gas
 */
describe('GasModule - Unit Tests', () => {
    // GasModule instance and mock HTTP client
    let gasModule: GasModule;
    let mockHttpClient: jest.Mocked<HttpClient>;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create a mock HTTP client with properly typed functions

        mockHttpClient = {
            baseURL: 'http://localhost:8669',
            http: jest.fn().mockReturnValue(Promise.resolve({})),
            get: jest.fn().mockReturnValue(Promise.resolve({})),
            post: jest.fn().mockReturnValue(Promise.resolve({})),
            put: jest.fn().mockReturnValue(Promise.resolve({})),
            delete: jest.fn().mockReturnValue(Promise.resolve({}))
        } as unknown as jest.Mocked<HttpClient>;

        // Create a new GasModule instance with the mock dependencies
        // For testing purposes, we need a type cast but need to follow linter rules
        gasModule = new GasModule(mockHttpClient);

        // Mock internal methods of GasModule
        // @ts-expect-error - Accessing private property for testing
        gasModule._isValidRevision = mockRevisionIsValid;
    });

    /**
     * Test suite for 'getMaxPriorityFeePerGas' method
     */
    describe('getMaxPriorityFeePerGas', () => {
        test('Should return maxPriorityFeePerGas from a valid response', async () => {
            const mockPriorityFee = '0x9184e72a000'; // 100 Gwei

            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.get.mockResolvedValue({
                maxPriorityFeePerGas: mockPriorityFee
            });

            const result = await gasModule.getMaxPriorityFeePerGas();

            expect(result).toBe(mockPriorityFee);
            expect(mockHttpClient.get).toHaveBeenCalledWith('/fees/priority');
        });

        test('Should throw InvalidDataType if response is null', async () => {
            // Mock a null response
            mockHttpClient.get.mockResolvedValue(null);

            await expect(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow(
                InvalidDataType
            );
        });

        test('Should throw InvalidDataType if maxPriorityFeePerGas is missing', async () => {
            // Mock a response with missing maxPriorityFeePerGas
            mockHttpClient.get.mockResolvedValue({
                someOtherField: 'value'
            });

            await expect(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow(
                InvalidDataType
            );
        });

        test('Should throw InvalidDataType if maxPriorityFeePerGas is empty string', async () => {
            // Mock a response with empty maxPriorityFeePerGas
            mockHttpClient.get.mockResolvedValue({
                maxPriorityFeePerGas: ''
            });

            await expect(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow(
                InvalidDataType
            );
        });

        test('Should throw if HTTP request fails', async () => {
            // Mock a failed HTTP request
            mockHttpClient.get.mockRejectedValue(new Error('Network error'));

            await expect(gasModule.getMaxPriorityFeePerGas()).rejects.toThrow();
        });
    });

    /**
     * Test suite for 'getFeeHistory' method
     */
    describe('getFeeHistory', () => {
        const mockFeeHistoryResponse = {
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        };

        test('Should return fee history for valid parameters', async () => {
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.http.mockResolvedValue(mockFeeHistoryResponse);

            const result = await gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 'best', // Using 'best' instead of 'latest'
                rewardPercentiles: [25, 75]
            });

            expect(result).toEqual(mockFeeHistoryResponse);
            // Direct URL check to avoid encoding differences
            expect(mockHttpClient.http).toHaveBeenCalledWith(
                HttpMethod.GET,
                '/fees/history?blockCount=4&newestBlock=best&rewardPercentiles=25%2C75'
            );
        });

        test('Should throw InvalidDataType if blockCount is invalid', async () => {
            await expect(
                gasModule.getFeeHistory({
                    blockCount: 0,
                    newestBlock: 'best'
                })
            ).rejects.toThrow(InvalidDataType);
        });

        test('Should throw InvalidDataType if newestBlock is not valid', async () => {
            // Mock Revision.isValid to return false for this test
            mockRevisionIsValid.mockReturnValueOnce(false);

            await expect(
                gasModule.getFeeHistory({
                    blockCount: 4,
                    newestBlock: 'invalid'
                })
            ).rejects.toThrow(InvalidDataType);
        });

        test('Should include rewardPercentiles in request when provided', async () => {
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.http.mockResolvedValue(mockFeeHistoryResponse);

            await gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 'best',
                rewardPercentiles: [25, 75]
            });

            expect(mockHttpClient.http).toHaveBeenCalled();
        });

        test('Should throw InvalidDataType if response is null', async () => {
            // Mock a null response
            mockHttpClient.http.mockResolvedValue(null);

            await expect(
                gasModule.getFeeHistory({
                    blockCount: 4,
                    newestBlock: 'best'
                })
            ).rejects.toThrow(InvalidDataType);
        });

        test('Should handle numeric block number', async () => {
            // Mock the HTTP method response directly (without data wrapper)
            mockHttpClient.http.mockResolvedValue(mockFeeHistoryResponse);

            await gasModule.getFeeHistory({
                blockCount: 4,
                newestBlock: 12345
            });

            // Direct URL check
            expect(mockHttpClient.http).toHaveBeenCalledWith(
                HttpMethod.GET,
                '/fees/history?blockCount=4&newestBlock=12345'
            );
        });
    });
});
