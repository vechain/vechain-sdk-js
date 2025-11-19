"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_network_1 = require("@vechain/sdk-network");
const transaction_adapter_1 = require("../../src/adapters/transaction-adapter");
(0, globals_1.describe)('Transaction adapter tests', () => {
    let provider;
    (0, globals_1.beforeEach)(() => {
        provider = new sdk_network_1.HardhatVeChainProvider(new sdk_network_1.ProviderInternalBaseWallet([]), sdk_network_1.THOR_SOLO_URL, (message, parent) => new Error(message, parent));
        // Mock the fork detector and gas-related methods
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockImplementation(async () => await Promise.resolve(false));
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockImplementation(async () => await Promise.resolve('100'));
        globals_1.jest.spyOn(provider.thorClient.gas, 'getMaxPriorityFeePerGas').mockImplementation(async () => await Promise.resolve('50'));
    });
    (0, globals_1.test)('Should calculate priority fee based on fee history when rewards are equal', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        // Set base fee to 1000
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValueOnce('1000');
        // Mock fee history with equal rewards
        globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(async () => await Promise.resolve({
            oldestBlock: '0x0',
            baseFeePerGas: ['0x1000'],
            gasUsedRatio: ['0x8000'], // 0.5 as hex string
            reward: [['0x20', '0x20', '0x20']] // Equal rewards: 25th, 50th, 75th percentiles
        }));
        const tx = {
            to: '0x123'
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        // Since rewards are equal, it should use the 75th percentile (0x20 = 32)
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(32, 46) = 32
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 1032n, // baseFee + maxPriorityFeePerGas
            maxPriorityFeePerGas: 32n,
            gasPriceCoef: undefined
        });
    });
    (0, globals_1.test)('Should calculate priority fee based on average of 75th percentiles', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        // Set base fee to 1000
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValueOnce('1000');
        // Mock fee history with varying rewards across blocks
        globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(async () => await Promise.resolve({
            oldestBlock: '0x0',
            baseFeePerGas: ['0x1000', '0x1000'],
            gasUsedRatio: ['0x8000', '0x8000'], // 0.5 as hex string
            reward: [
                ['0x10', '0x20', '0x30'], // Block 1: different percentiles
                ['0x15', '0x25', '0x35'] // Block 2: different percentiles
            ]
        }));
        const tx = {
            to: '0x123'
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        // Average of 75th percentiles: (0x30 + 0x35) / 2 = (48 + 53) / 2 = 50
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(46, 50) = 46
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 1046n, // baseFee + maxPriorityFeePerGas
            maxPriorityFeePerGas: 46n,
            gasPriceCoef: undefined
        });
    });
    (0, globals_1.test)('Should fallback to getMaxPriorityFeePerGas when fee history is empty', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        // Set base fee to 1000
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValueOnce('1000');
        // Mock empty fee history
        globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(async () => await Promise.resolve({
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        }));
        // Mock fallback priority fee
        globals_1.jest.spyOn(provider.thorClient.gas, 'getMaxPriorityFeePerGas').mockResolvedValueOnce('20');
        const tx = {
            to: '0x123'
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        // Fallback priority fee is 20
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(20, 46) = 20
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 1020n, // baseFee + maxPriorityFeePerGas
            maxPriorityFeePerGas: 20n,
            gasPriceCoef: undefined
        });
    });
    (0, globals_1.test)('Should use gasPriceCoef for pre-Galactica transactions', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(false);
        const tx = {
            to: '0x123',
            gasPrice: 100
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 100,
            gasPrice: undefined
        });
    });
    (0, globals_1.test)('Should use default gasPriceCoef 0 for pre-Galactica transactions without gasPrice', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(false);
        const tx = {
            to: '0x123'
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 0
        });
    });
    (0, globals_1.test)('Should reject dynamic fee transaction before Galactica fork', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(false);
        const tx = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };
        await (0, globals_1.expect)((0, transaction_adapter_1.adaptTransaction)(tx, provider)).rejects.toThrow('Dynamic fee transaction (maxFeePerGas/maxPriorityFeePerGas) is not allowed before Galactica fork');
    });
    (0, globals_1.test)('Should use provided dynamic fees for post-Galactica transactions', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });
    (0, globals_1.test)('Should reject incomplete dynamic fee settings', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            maxFeePerGas: 200n // Missing maxPriorityFeePerGas
        };
        await (0, globals_1.expect)((0, transaction_adapter_1.adaptTransaction)(tx, provider)).rejects.toThrow('Both maxFeePerGas and maxPriorityFeePerGas must be set for dynamic fee transactions');
    });
    (0, globals_1.test)('Should handle missing base fee gracefully', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValueOnce(null);
        const tx = {
            to: '0x123'
        };
        await (0, globals_1.expect)((0, transaction_adapter_1.adaptTransaction)(tx, provider)).rejects.toThrow('Unable to get best block base fee per gas');
    });
    (0, globals_1.test)('Should prioritize dynamic fee parameters over gasPrice (consistent with fillDefaultBodyOptions)', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            gasPrice: 100,
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        // Dynamic fee parameters should take precedence over gasPrice
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        });
    });
    (0, globals_1.test)('Should prioritize dynamic fee parameters over gasPrice with different values', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x456',
            value: 1000000000000000000n,
            gasPrice: 75,
            maxFeePerGas: 500n,
            maxPriorityFeePerGas: 250n
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        // Dynamic fee parameters should take precedence over gasPrice, preserve other fields
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x456',
            value: 1000000000000000000n,
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: 500n,
            maxPriorityFeePerGas: 250n
        });
    });
    (0, globals_1.test)('Should prioritize dynamic fee parameters over gasPrice with hex values', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x789',
            gasPrice: 200,
            maxFeePerGas: '0x1000',
            maxPriorityFeePerGas: '0x500'
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        // Dynamic fee parameters should take precedence over gasPrice
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x789',
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: '0x1000',
            maxPriorityFeePerGas: '0x500'
        });
    });
    (0, globals_1.test)('Should demonstrate consistent behavior across all fee parameter combinations', async () => {
        // Test case 1: Only gasPrice specified (pre-Galactica)
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(false);
        const tx1 = {
            to: '0x111',
            gasPrice: 50
        };
        const adaptedTx1 = await (0, transaction_adapter_1.adaptTransaction)(tx1, provider);
        (0, globals_1.expect)(adaptedTx1).toEqual({
            to: '0x111',
            gasPriceCoef: 50,
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined
        });
        // Test case 2: Only dynamic fees specified (post-Galactica)
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx2 = {
            to: '0x222',
            maxFeePerGas: 1000n,
            maxPriorityFeePerGas: 500n
        };
        const adaptedTx2 = await (0, transaction_adapter_1.adaptTransaction)(tx2, provider);
        (0, globals_1.expect)(adaptedTx2).toEqual({
            to: '0x222',
            maxFeePerGas: 1000n,
            maxPriorityFeePerGas: 500n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
        // Test case 3: Both specified - dynamic fees should win (post-Galactica)
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx3 = {
            to: '0x333',
            gasPrice: 25,
            maxFeePerGas: 2000n,
            maxPriorityFeePerGas: 1000n
        };
        const adaptedTx3 = await (0, transaction_adapter_1.adaptTransaction)(tx3, provider);
        (0, globals_1.expect)(adaptedTx3).toEqual({
            to: '0x333',
            gasPriceCoef: undefined,
            gasPrice: undefined,
            maxFeePerGas: 2000n,
            maxPriorityFeePerGas: 1000n
        });
    });
    (0, globals_1.test)('Should throw error for maxPriorityFeePerGas + gasPrice without maxFeePerGas', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            maxPriorityFeePerGas: 50n,
            gasPrice: 100
        };
        await (0, globals_1.expect)((0, transaction_adapter_1.adaptTransaction)(tx, provider)).rejects.toThrow('Invalid parameter combination: maxPriorityFeePerGas and gasPrice cannot be used together without maxFeePerGas');
    });
    (0, globals_1.test)('Should throw error for maxFeePerGas + gasPrice without maxPriorityFeePerGas', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            maxFeePerGas: 200n,
            gasPrice: 100
        };
        await (0, globals_1.expect)((0, transaction_adapter_1.adaptTransaction)(tx, provider)).rejects.toThrow('Invalid parameter combination: maxFeePerGas and gasPrice cannot be used together without maxPriorityFeePerGas');
    });
    (0, globals_1.test)('Should use only maxFeePerGas and maxPriorityFeePerGas when all three parameters are provided', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n,
            gasPrice: 100
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });
    (0, globals_1.test)('Should use maxFeePerGas and maxPriorityFeePerGas when both are provided', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 50n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });
    (0, globals_1.test)('Should use gasPrice for legacy transaction when only gasPrice is provided', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValueOnce(true);
        const tx = {
            to: '0x123',
            gasPrice: 100
        };
        const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(tx, provider);
        (0, globals_1.expect)(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 100,
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined
        });
    });
});
