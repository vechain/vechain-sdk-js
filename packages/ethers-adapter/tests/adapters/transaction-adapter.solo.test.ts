import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL
} from '@vechain/sdk-network';
import type { TransactionRequest } from 'ethers';
import { adaptTransaction } from '../../src/adapters/transaction-adapter';

describe('Transaction adapter tests', () => {
    let provider: HardhatVeChainProvider;

    beforeEach(() => {
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent)
        );

        // Mock the fork detector and gas-related methods
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(false));
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('100'));
        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('50'));
    });

    test('Should calculate priority fee based on fee history when rewards are equal', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        // Set base fee to 1000
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValueOnce('1000');

        // Mock fee history with equal rewards
        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(
            async () =>
                await Promise.resolve({
                    oldestBlock: '0x0',
                    baseFeePerGas: ['0x1000'],
                    gasUsedRatio: ['0x8000'], // 0.5 as hex string
                    reward: [['0x20', '0x20', '0x20']] // Equal rewards: 25th, 50th, 75th percentiles
                })
        );

        const tx: TransactionRequest = {
            to: '0x123'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        // Since rewards are equal, it should use the 75th percentile (0x20 = 32)
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(32, 46) = 32
        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 1032n, // baseFee + maxPriorityFeePerGas
            maxPriorityFeePerGas: 32n,
            gasPriceCoef: undefined
        });
    });

    test('Should calculate priority fee based on average of 75th percentiles', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        // Set base fee to 1000
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValueOnce('1000');

        // Mock fee history with varying rewards across blocks
        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(
            async () =>
                await Promise.resolve({
                    oldestBlock: '0x0',
                    baseFeePerGas: ['0x1000', '0x1000'],
                    gasUsedRatio: ['0x8000', '0x8000'], // 0.5 as hex string
                    reward: [
                        ['0x10', '0x20', '0x30'], // Block 1: different percentiles
                        ['0x15', '0x25', '0x35'] // Block 2: different percentiles
                    ]
                })
        );

        const tx: TransactionRequest = {
            to: '0x123'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        // Average of 75th percentiles: (0x30 + 0x35) / 2 = (48 + 53) / 2 = 50
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(46, 50) = 46
        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 1046n, // baseFee + maxPriorityFeePerGas
            maxPriorityFeePerGas: 46n,
            gasPriceCoef: undefined
        });
    });

    test('Should fallback to getMaxPriorityFeePerGas when fee history is empty', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        // Set base fee to 1000
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValueOnce('1000');

        // Mock empty fee history
        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(
            async () =>
                await Promise.resolve({
                    oldestBlock: '0x0',
                    baseFeePerGas: [],
                    gasUsedRatio: [],
                    reward: []
                })
        );

        // Mock fallback priority fee
        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockResolvedValueOnce('20');

        const tx: TransactionRequest = {
            to: '0x123'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        // Fallback priority fee is 20
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(20, 46) = 20
        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 1020n, // baseFee + maxPriorityFeePerGas
            maxPriorityFeePerGas: 20n,
            gasPriceCoef: undefined
        });
    });

    test('Should use gasPriceCoef for pre-Galactica transactions', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx: TransactionRequest = {
            to: '0x123',
            gasPrice: 100
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 100,
            gasPrice: undefined
        });
    });

    test('Should use default gasPriceCoef 0 for pre-Galactica transactions without gasPrice', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx: TransactionRequest = {
            to: '0x123'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 0
        });
    });

    test('Should reject dynamic fee transaction before Galactica fork', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Dynamic fee transaction (maxFeePerGas/maxPriorityFeePerGas) is not allowed before Galactica fork'
        );
    });

    test('Should use provided dynamic fees for post-Galactica transactions', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });

    test('Should reject incomplete dynamic fee settings', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n // Missing maxPriorityFeePerGas
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Both maxFeePerGas and maxPriorityFeePerGas must be set for dynamic fee transactions'
        );
    });

    test('Should handle missing base fee gracefully', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValueOnce(null);

        const tx: TransactionRequest = {
            to: '0x123'
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Unable to get best block base fee per gas'
        );
    });

    test('Should prioritize dynamic fee parameters over gasPrice (consistent with fillDefaultBodyOptions)', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            gasPrice: 100,
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        // Dynamic fee parameters should take precedence over gasPrice
        expect(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        });
    });

    test('Should prioritize dynamic fee parameters over gasPrice with different values', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x456',
            value: 1000000000000000000n,
            gasPrice: 75,
            maxFeePerGas: 500n,
            maxPriorityFeePerGas: 250n
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        // Dynamic fee parameters should take precedence over gasPrice, preserve other fields
        expect(adaptedTx).toEqual({
            to: '0x456',
            value: 1000000000000000000n,
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: 500n,
            maxPriorityFeePerGas: 250n
        });
    });

    test('Should prioritize dynamic fee parameters over gasPrice with hex values', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x789',
            gasPrice: 200,
            maxFeePerGas: '0x1000',
            maxPriorityFeePerGas: '0x500'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        // Dynamic fee parameters should take precedence over gasPrice
        expect(adaptedTx).toEqual({
            to: '0x789',
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: '0x1000',
            maxPriorityFeePerGas: '0x500'
        });
    });

    test('Should demonstrate consistent behavior across all fee parameter combinations', async () => {
        // Test case 1: Only gasPrice specified (pre-Galactica)
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx1: TransactionRequest = {
            to: '0x111',
            gasPrice: 50
        };
        const adaptedTx1 = await adaptTransaction(tx1, provider);
        expect(adaptedTx1).toEqual({
            to: '0x111',
            gasPriceCoef: 50,
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined
        });

        // Test case 2: Only dynamic fees specified (post-Galactica)
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx2: TransactionRequest = {
            to: '0x222',
            maxFeePerGas: 1000n,
            maxPriorityFeePerGas: 500n
        };
        const adaptedTx2 = await adaptTransaction(tx2, provider);
        expect(adaptedTx2).toEqual({
            to: '0x222',
            maxFeePerGas: 1000n,
            maxPriorityFeePerGas: 500n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });

        // Test case 3: Both specified - dynamic fees should win (post-Galactica)
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx3: TransactionRequest = {
            to: '0x333',
            gasPrice: 25,
            maxFeePerGas: 2000n,
            maxPriorityFeePerGas: 1000n
        };
        const adaptedTx3 = await adaptTransaction(tx3, provider);
        expect(adaptedTx3).toEqual({
            to: '0x333',
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: 2000n,
            maxPriorityFeePerGas: 1000n
        });
    });

    test('Should throw error for maxPriorityFeePerGas + gasPrice without maxFeePerGas', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxPriorityFeePerGas: 50n,
            gasPrice: 100
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Invalid parameter combination: maxPriorityFeePerGas and gasPrice cannot be used together without maxFeePerGas'
        );
    });

    test('Should throw error for maxFeePerGas + gasPrice without maxPriorityFeePerGas', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            gasPrice: 100
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Invalid parameter combination: maxFeePerGas and gasPrice cannot be used together without maxPriorityFeePerGas'
        );
    });

    test('Should use only maxFeePerGas and maxPriorityFeePerGas when all three parameters are provided', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n,
            gasPrice: 100
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });

    test('Should use maxFeePerGas and maxPriorityFeePerGas when both are provided', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });

    test('Should use gasPrice for legacy transaction when only gasPrice is provided', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            gasPrice: 100
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 100,
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined
        });
    });
});
