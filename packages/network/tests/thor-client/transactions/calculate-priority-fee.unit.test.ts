import { HexUInt } from '@vechain/sdk-core';
import { ThorClient, TESTNET_URL } from '../../../src';

/**
 * Calculate priority fee unit tests.
 *
 * @group unit/clients/thor-client/transactions
 */
describe('TransactionsModule - Priority Fee Calculation Tests', () => {
    test('calculateDefaultMaxPriorityFeePerGas should cap fee at 4.6% of base fee when 75th percentile is higher', async () => {
        // Create a Thor client instance
        const client = ThorClient.at(TESTNET_URL);

        // Mock the fee history response
        const mockFeeHistory = {
            oldestBlock: '0x1',
            baseFeePerGas: ['0x1', '0x2', '0x3'],
            gasUsedRatio: ['0.5', '0.6', '0.7'],
            reward: [
                ['0x1', '0x2', '0x3'],
                ['0x4', '0x5', '0x6'],
                ['0x7', '0x8', '0x9']
            ]
        };

        // Mock the getFeeHistory method
        jest.spyOn(client.gas, 'getFeeHistory').mockResolvedValue(
            mockFeeHistory
        );

        // Call the method directly
        const result =
            // @ts-expect-error - Accessing private method for testing
            await client.transactions.calculateDefaultMaxPriorityFeePerGas(
                1000n
            );

        // The 75th percentile from the mock data is 0x9 = 9
        // 4.6% of 1000 = 46
        // Therefore, priority fee should be capped at 9 (min of 9 and 46)
        const priorityFee = HexUInt.of(result).bi;
        expect(priorityFee).toBe(9n);
    });

    test('calculateDefaultMaxPriorityFeePerGas should use 75th percentile when it is lower than 4.6% of base fee', async () => {
        // Create a Thor client instance
        const client = ThorClient.at(TESTNET_URL);

        // Mock the fee history response with high values
        const mockFeeHistory = {
            oldestBlock: '0x1',
            baseFeePerGas: ['0x1', '0x2', '0x3'],
            gasUsedRatio: ['0.5', '0.6', '0.7'],
            reward: [
                ['0x1', '0x2', '0x100'],
                ['0x4', '0x5', '0x100'],
                ['0x7', '0x8', '0x100']
            ]
        };

        // Mock the getFeeHistory method
        jest.spyOn(client.gas, 'getFeeHistory').mockResolvedValue(
            mockFeeHistory
        );

        // Call the method directly
        const result =
            // @ts-expect-error - Accessing private method for testing
            await client.transactions.calculateDefaultMaxPriorityFeePerGas(
                1000n
            );

        // The 75th percentile from the mock data is 0x100 = 256
        // 4.6% of 1000 = 46
        // Therefore, priority fee should be 46 (min of 256 and 46)
        const priorityFee = HexUInt.of(result).bi;
        expect(priorityFee).toBe(46n);
    });

    test('calculateDefaultMaxPriorityFeePerGas should fallback to getMaxPriorityFeePerGas when fee history is not available', async () => {
        // Create a Thor client instance
        const client = ThorClient.at(TESTNET_URL);

        // Mock the fee history response with no rewards
        const mockFeeHistory = {
            oldestBlock: '0x1',
            baseFeePerGas: ['0x1', '0x2', '0x3'],
            gasUsedRatio: ['0.5', '0.6', '0.7']
        };

        // Mock the getMaxPriorityFeePerGas method
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue(
            '0x64'
        ); // 100

        // Mock the getFeeHistory method
        jest.spyOn(client.gas, 'getFeeHistory').mockResolvedValue(
            mockFeeHistory
        );

        // Call the method directly
        const result =
            // @ts-expect-error - Accessing private method for testing
            await client.transactions.calculateDefaultMaxPriorityFeePerGas(
                1000n
            );

        // The fallback value is 0x64 = 100
        // 4.6% of 1000 = 46
        // Therefore, priority fee should be 46 (min of 100 and 46)
        const priorityFee = HexUInt.of(result).bi;
        expect(priorityFee).toBe(46n);
    });

    test('calculateDefaultMaxPriorityFeePerGas should use average of 75th percentiles when rewards are not equal', async () => {
        // Create a Thor client instance
        const client = ThorClient.at(TESTNET_URL);

        // Mock the fee history response with different rewards in each block
        const mockFeeHistory = {
            oldestBlock: '0x1',
            baseFeePerGas: ['0x1', '0x2', '0x3'],
            gasUsedRatio: ['0.5', '0.6', '0.7'],
            reward: [
                ['0x1', '0x2', '0x5'], // 75th percentile = 5
                ['0x4', '0x5', '0xF'], // 75th percentile = 15
                ['0x7', '0x8', '0xA'] // 75th percentile = 10 (not equal to other rewards)
            ]
        };

        // Mock the getFeeHistory method
        jest.spyOn(client.gas, 'getFeeHistory').mockResolvedValue(
            mockFeeHistory
        );

        // Call the method directly
        const result =
            // @ts-expect-error - Accessing private method for testing
            await client.transactions.calculateDefaultMaxPriorityFeePerGas(
                1000n
            );

        // Average of 75th percentiles: (5 + 15 + 10) / 3 = 10
        // 4.6% of 1000 = 46
        // Therefore, priority fee should be 10 (min of 10 and 46)
        const priorityFee = HexUInt.of(result).bi;
        expect(priorityFee).toBe(10n);
    });
});
