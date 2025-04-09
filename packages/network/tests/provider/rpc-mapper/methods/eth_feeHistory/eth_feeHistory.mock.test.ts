import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper unit tests for 'eth_feeHistory' method
 *
 * @group unit/rpc-mapper/methods/eth_feeHistory
 */
describe('RPC Mapper - eth_feeHistory method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

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
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
    });

    test('Should return fee history from the API with latest block', async () => {
        const mock = jest
            .spyOn(thorClient.gas, 'getFeeHistory')
            .mockResolvedValue(mockFeeHistoryResponse);
        const result = await provider.request({
            method: RPC_METHODS.eth_feeHistory,
            params: [4, 'latest', [25, 75]]
        });
        expect(result).toEqual(mockFeeHistoryResponse);
        expect(mock).toHaveBeenCalledWith({
            blockCount: 4,
            newestBlock: 'best',
            rewardPercentiles: [25, 75]
        });
    });

    test('Should handle missing rewardPercentiles parameter', async () => {
        const mock = jest
            .spyOn(thorClient.gas, 'getFeeHistory')
            .mockResolvedValue(mockFeeHistoryResponse);
        const result = await provider.request({
            method: RPC_METHODS.eth_feeHistory,
            params: [4, 'latest']
        });
        expect(result).toEqual(mockFeeHistoryResponse);
        expect(mock).toHaveBeenCalledWith({
            blockCount: 4,
            newestBlock: 'best'
        });
    });

    test('Should handle numeric block number', async () => {
        const mock = jest
            .spyOn(thorClient.gas, 'getFeeHistory')
            .mockResolvedValue(mockFeeHistoryResponse);
        const result = await provider.request({
            method: RPC_METHODS.eth_feeHistory,
            params: [4, 12345, [25, 75]]
        });

        expect(result).toEqual(mockFeeHistoryResponse);
        expect(mock).toHaveBeenCalledWith({
            blockCount: 4,
            newestBlock: '12345',
            rewardPercentiles: [25, 75]
        });
    });

    test('Should throw error for invalid blockCount', async () => {
        await expect(
            provider.request({
                method: RPC_METHODS.eth_feeHistory,
                params: [0, 'latest', [25, 75]]
            })
        ).rejects.toThrow(JSONRPCInvalidParams);
    });

    test('Should throw error for missing newestBlock', async () => {
        await expect(
            provider.request({
                method: RPC_METHODS.eth_feeHistory,
                params: [4]
            })
        ).rejects.toThrow(JSONRPCInvalidParams);
    });

    test('Should throw error for invalid params array', async () => {
        await expect(
            provider.request({
                method: RPC_METHODS.eth_feeHistory,
                params: ['invalid'] as unknown[]
            })
        ).rejects.toThrow(JSONRPCInvalidParams);
    });
});
