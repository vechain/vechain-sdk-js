import { describe, test, expect } from '@jest/globals';
import {
    applyGasPadding,
    applyConservativePadding,
    applyStandardPadding,
    applySafePadding,
    applyAggressivePadding,
    GasPaddingManager,
    GAS_PADDING_PRESETS,
    DEFAULT_GAS_PADDING_OPTIONS,
    validateGasPaddingOptions,
    type GasPaddingOptions
} from '../../src/utils/gas-padding';

/**
 * Gas padding utility tests
 * 
 * @group unit/utils/gas-padding
 */
describe('Gas Padding Utility', () => {
    describe('validateGasPaddingOptions', () => {
        test('should accept valid options', () => {
            expect(() => validateGasPaddingOptions({
                multiplier: 1.2,
                fixedPadding: 1000,
                minGas: 21000,
                maxGas: 10000000
            })).not.toThrow();
        });

        test('should reject multiplier < 1', () => {
            expect(() => validateGasPaddingOptions({ multiplier: 0.9 }))
                .toThrow('Gas multiplier must be greater than or equal to 1');
        });

        test('should reject negative fixed padding', () => {
            expect(() => validateGasPaddingOptions({ fixedPadding: -100 }))
                .toThrow('Fixed padding cannot be negative');
        });

        test('should reject negative gas limits', () => {
            expect(() => validateGasPaddingOptions({ minGas: -1 }))
                .toThrow('Minimum gas cannot be negative');
            expect(() => validateGasPaddingOptions({ maxGas: -1 }))
                .toThrow('Maximum gas cannot be negative');
        });

        test('should reject minGas > maxGas', () => {
            expect(() => validateGasPaddingOptions({ minGas: 100000, maxGas: 50000 }))
                .toThrow('Minimum gas cannot be greater than maximum gas');
        });
    });

    describe('applyGasPadding', () => {
        test('should apply default 20% padding', () => {
            const result = applyGasPadding(100000);
            expect(result).toBe(120000); // 100000 * 1.2
        });

        test('should work with bigint input', () => {
            const result = applyGasPadding(BigInt(100000));
            expect(result).toBe(120000);
        });

        test('should apply custom multiplier', () => {
            const result = applyGasPadding(100000, { multiplier: 1.5 });
            expect(result).toBe(150000);
        });

        test('should apply fixed padding', () => {
            const result = applyGasPadding(100000, { 
                multiplier: 1.0, // No multiplier padding
                fixedPadding: 10000 
            });
            expect(result).toBe(110000);
        });

        test('should apply both multiplier and fixed padding', () => {
            const result = applyGasPadding(100000, { 
                multiplier: 1.2,
                fixedPadding: 5000 
            });
            expect(result).toBe(125000); // (100000 * 1.2) + 5000
        });

        test('should enforce minimum gas', () => {
            const result = applyGasPadding(1000, { 
                multiplier: 1.1,
                minGas: 25000 
            });
            expect(result).toBe(25000);
        });

        test('should enforce maximum gas', () => {
            const result = applyGasPadding(1000000, { 
                multiplier: 2.0,
                maxGas: 1500000 
            });
            expect(result).toBe(1500000);
        });

        test('should handle decimal results by ceiling', () => {
            const result = applyGasPadding(100001, { multiplier: 1.1 });
            expect(result).toBe(Math.ceil(100001 * 1.1));
        });

        test('should reject negative gas estimates', () => {
            expect(() => applyGasPadding(-100))
                .toThrow('Gas estimate cannot be negative');
        });

        test('should reject invalid options', () => {
            expect(() => applyGasPadding(100000, { multiplier: 0.9 }))
                .toThrow('Gas multiplier must be greater than or equal to 1');
        });
    });

    describe('preset functions', () => {
        const gasEstimate = 100000;

        test('applyConservativePadding should apply 10% padding', () => {
            const result = applyConservativePadding(gasEstimate);
            expect(result).toBe(Math.ceil(gasEstimate * 1.1)); // Account for ceiling operation
        });

        test('applyStandardPadding should apply 20% padding', () => {
            const result = applyStandardPadding(gasEstimate);
            expect(result).toBe(120000);
        });

        test('applySafePadding should apply 30% padding', () => {
            const result = applySafePadding(gasEstimate);
            expect(result).toBe(130000);
        });

        test('applyAggressivePadding should apply 50% padding', () => {
            const result = applyAggressivePadding(gasEstimate);
            expect(result).toBe(150000);
        });

        test('preset functions should work with bigint', () => {
            const result = applyStandardPadding(BigInt(gasEstimate));
            expect(result).toBe(120000);
        });
    });

    describe('GasPaddingManager', () => {
        test('should initialize with default options', () => {
            const manager = new GasPaddingManager();
            const options = manager.getOptions();
            expect(options).toEqual(DEFAULT_GAS_PADDING_OPTIONS);
        });

        test('should initialize with custom options', () => {
            const customOptions = { multiplier: 1.3, minGas: 30000 };
            const manager = new GasPaddingManager(customOptions);
            const options = manager.getOptions();
            expect(options.multiplier).toBe(1.3);
            expect(options.minGas).toBe(30000);
            expect(options.fixedPadding).toBe(DEFAULT_GAS_PADDING_OPTIONS.fixedPadding);
        });

        test('should apply padding using configured options', () => {
            const manager = new GasPaddingManager({ multiplier: 1.25 });
            const result = manager.applyPadding(100000);
            expect(result).toBe(125000);
        });

        test('should update options', () => {
            const manager = new GasPaddingManager({ multiplier: 1.2 });
            manager.updateOptions({ multiplier: 1.4, fixedPadding: 2000 });
            
            const result = manager.applyPadding(100000);
            expect(result).toBe(142000); // (100000 * 1.4) + 2000
        });

        test('should validate options on update', () => {
            const manager = new GasPaddingManager();
            expect(() => manager.updateOptions({ multiplier: 0.8 }))
                .toThrow('Gas multiplier must be greater than or equal to 1');
        });

        test('should reset to defaults', () => {
            const manager = new GasPaddingManager({ multiplier: 1.5 });
            manager.resetToDefaults();
            
            const options = manager.getOptions();
            expect(options).toEqual(DEFAULT_GAS_PADDING_OPTIONS);
        });

        test('should validate options on construction', () => {
            expect(() => new GasPaddingManager({ multiplier: 0.9 }))
                .toThrow('Gas multiplier must be greater than or equal to 1');
        });
    });

    describe('constants', () => {
        test('GAS_PADDING_PRESETS should have correct values', () => {
            expect(GAS_PADDING_PRESETS.CONSERVATIVE.multiplier).toBe(1.1);
            expect(GAS_PADDING_PRESETS.STANDARD.multiplier).toBe(1.2);
            expect(GAS_PADDING_PRESETS.SAFE.multiplier).toBe(1.3);
            expect(GAS_PADDING_PRESETS.AGGRESSIVE.multiplier).toBe(1.5);
        });

        test('DEFAULT_GAS_PADDING_OPTIONS should have sensible defaults', () => {
            expect(DEFAULT_GAS_PADDING_OPTIONS.multiplier).toBe(1.2);
            expect(DEFAULT_GAS_PADDING_OPTIONS.fixedPadding).toBe(0);
            expect(DEFAULT_GAS_PADDING_OPTIONS.minGas).toBe(21000);
            expect(DEFAULT_GAS_PADDING_OPTIONS.maxGas).toBe(10000000);
        });
    });

    describe('real-world scenarios', () => {
        test('should handle typical contract interaction gas estimates', () => {
            const contractCallGas = 85000;
            const paddedGas = applyStandardPadding(contractCallGas);
            expect(paddedGas).toBe(102000);
            expect(paddedGas).toBeGreaterThan(contractCallGas);
        });

        test('should handle very small gas estimates with minimum', () => {
            const smallGas = 5000;
            const paddedGas = applyGasPadding(smallGas, { minGas: 21000 });
            expect(paddedGas).toBe(21000);
        });

        test('should handle very large gas estimates with maximum', () => {
            const largeGas = 8000000;
            const paddedGas = applyGasPadding(largeGas, { 
                multiplier: 2.0,
                maxGas: 10000000 
            });
            expect(paddedGas).toBe(10000000);
        });

        test('should work with manager for consistent application padding', () => {
            const manager = new GasPaddingManager({ 
                multiplier: 1.25,
                fixedPadding: 1000,
                minGas: 25000 
            });

            const estimates = [50000, 100000, 200000];
            const paddedEstimates = estimates.map(gas => manager.applyPadding(gas));

            expect(paddedEstimates[0]).toBe(63500); // (50000 * 1.25) + 1000
            expect(paddedEstimates[1]).toBe(126000); // (100000 * 1.25) + 1000
            expect(paddedEstimates[2]).toBe(251000); // (200000 * 1.25) + 1000
        });
    });
});
