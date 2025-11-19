"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Mapper unit tests for 'eth_feeHistory' method
 *
 * @group unit/rpc-mapper/methods/eth_feeHistory
 */
(0, globals_1.describe)('RPC Mapper - eth_feeHistory method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient;
    let provider;
    // Mock response for fee history
    const mockFeeHistoryResponse = {
        oldestBlock: '0x0',
        baseFeePerGas: [],
        gasUsedRatio: [],
        reward: []
    };
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        provider = new src_1.VeChainProvider(thorClient);
        // Mock Galactica fork detection to return true by default
        globals_1.jest.spyOn(thorClient.forkDetector, 'detectGalactica').mockResolvedValue(true);
    });
    (0, globals_1.test)('Should throw a method not implemented error when Galactica fork is not active', async () => {
        // Mock Galactica fork detection to return false
        globals_1.jest.spyOn(thorClient.forkDetector, 'detectGalactica').mockResolvedValue(false);
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: [4, 'latest', [25, 75]]
        })).rejects.toThrow(sdk_errors_1.JSONRPCMethodNotImplemented);
    });
    (0, globals_1.test)('Should return fee history from the API with latest block', async () => {
        const mock = globals_1.jest
            .spyOn(thorClient.gas, 'getFeeHistory')
            .mockResolvedValue(mockFeeHistoryResponse);
        const result = await provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: [4, 'latest', [25, 75]]
        });
        (0, globals_1.expect)(result).toEqual(mockFeeHistoryResponse);
        (0, globals_1.expect)(mock).toHaveBeenCalledWith({
            blockCount: 4,
            newestBlock: 'best',
            rewardPercentiles: [25, 75]
        });
    });
    (0, globals_1.test)('Should handle missing rewardPercentiles parameter', async () => {
        const mock = globals_1.jest
            .spyOn(thorClient.gas, 'getFeeHistory')
            .mockResolvedValue(mockFeeHistoryResponse);
        const result = await provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: [4, 'latest']
        });
        (0, globals_1.expect)(result).toEqual(mockFeeHistoryResponse);
        (0, globals_1.expect)(mock).toHaveBeenCalledWith({
            blockCount: 4,
            newestBlock: 'best'
        });
    });
    (0, globals_1.test)('Should handle numeric block number', async () => {
        const mock = globals_1.jest
            .spyOn(thorClient.gas, 'getFeeHistory')
            .mockResolvedValue(mockFeeHistoryResponse);
        const result = await provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: [4, 12345, [25, 75]]
        });
        (0, globals_1.expect)(result).toEqual(mockFeeHistoryResponse);
        (0, globals_1.expect)(mock).toHaveBeenCalledWith({
            blockCount: 4,
            newestBlock: '12345',
            rewardPercentiles: [25, 75]
        });
    });
    (0, globals_1.test)('Should throw error for invalid blockCount', async () => {
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: [0, 'latest', [25, 75]]
        })).rejects.toThrow(sdk_errors_1.JSONRPCInvalidParams);
    });
    (0, globals_1.test)('Should throw error for missing newestBlock', async () => {
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: [4]
        })).rejects.toThrow(sdk_errors_1.JSONRPCInvalidParams);
    });
    (0, globals_1.test)('Should throw error for invalid params array', async () => {
        await (0, globals_1.expect)(provider.request({
            method: src_1.RPC_METHODS.eth_feeHistory,
            params: ['invalid']
        })).rejects.toThrow(sdk_errors_1.JSONRPCInvalidParams);
    });
});
