/**
 * Simple Gas Padding Utility for VeChain SDK
 * 
 * This utility provides gas padding functionality that works with any version
 * of the VeChain SDK by accepting raw gas estimates and applying padding.
 */

/**
 * Gas padding configuration options
 */
export interface GasPaddingOptions {
    /** Multiplier for gas padding (e.g., 1.2 = 20% padding) */
    multiplier?: number;
    /** Fixed amount to add to gas estimate */
    fixedPadding?: number;
    /** Minimum gas limit */
    minGas?: number;
    /** Maximum gas limit */
    maxGas?: number;
}

/**
 * Default gas padding settings
 */
export const DEFAULT_GAS_PADDING_OPTIONS: Required<GasPaddingOptions> = {
    multiplier: 1.2,        // 20% padding
    fixedPadding: 0,        // No fixed padding
    minGas: 21000,          // Minimum transaction gas
    maxGas: 10000000        // 10M gas limit
};

/**
 * Validates gas padding options
 * @param options - Gas padding options to validate
 * @throws Error if options are invalid
 */
export function validateGasPaddingOptions(options: GasPaddingOptions): void {
    if (options.multiplier !== undefined && options.multiplier < 1) {
        throw new Error('Gas multiplier must be greater than or equal to 1');
    }
    if (options.fixedPadding !== undefined && options.fixedPadding < 0) {
        throw new Error('Fixed padding cannot be negative');
    }
    if (options.minGas !== undefined && options.minGas < 0) {
        throw new Error('Minimum gas cannot be negative');
    }
    if (options.maxGas !== undefined && options.maxGas < 0) {
        throw new Error('Maximum gas cannot be negative');
    }
    if (options.minGas !== undefined && options.maxGas !== undefined && options.minGas > options.maxGas) {
        throw new Error('Minimum gas cannot be greater than maximum gas');
    }
}

/**
 * Applies gas padding to a raw gas estimate
 * 
 * @param rawGasEstimate - The raw gas estimate (number or bigint)
 * @param options - Gas padding options
 * @returns Padded gas amount as number
 */
export function applyGasPadding(
    rawGasEstimate: number | bigint,
    options: GasPaddingOptions = {}
): number {
    // Validate options
    validateGasPaddingOptions(options);
    
    const config = { ...DEFAULT_GAS_PADDING_OPTIONS, ...options };
    
    // Convert to number for calculations
    const rawGas = typeof rawGasEstimate === 'bigint' 
        ? Number(rawGasEstimate) 
        : rawGasEstimate;
    
    if (rawGas < 0) {
        throw new Error('Gas estimate cannot be negative');
    }
    
    // Apply multiplier padding
    let paddedGas = Math.ceil(rawGas * config.multiplier);
    
    // Add fixed padding
    paddedGas += config.fixedPadding;
    
    // Apply limits
    paddedGas = Math.max(paddedGas, config.minGas);
    paddedGas = Math.min(paddedGas, config.maxGas);
    
    return paddedGas;
}

/**
 * Common gas padding presets
 */
export const GAS_PADDING_PRESETS = {
    /** Conservative: 10% padding */
    CONSERVATIVE: { multiplier: 1.1 },
    /** Standard: 20% padding */
    STANDARD: { multiplier: 1.2 },
    /** Safe: 30% padding */
    SAFE: { multiplier: 1.3 },
    /** Aggressive: 50% padding */
    AGGRESSIVE: { multiplier: 1.5 }
} as const;

/**
 * Convenience functions for common padding scenarios
 */
export const applyConservativePadding = (gasEstimate: number | bigint) => 
    applyGasPadding(gasEstimate, GAS_PADDING_PRESETS.CONSERVATIVE);

export const applyStandardPadding = (gasEstimate: number | bigint) => 
    applyGasPadding(gasEstimate, GAS_PADDING_PRESETS.STANDARD);

export const applySafePadding = (gasEstimate: number | bigint) => 
    applyGasPadding(gasEstimate, GAS_PADDING_PRESETS.SAFE);

export const applyAggressivePadding = (gasEstimate: number | bigint) => 
    applyGasPadding(gasEstimate, GAS_PADDING_PRESETS.AGGRESSIVE);

/**
 * Helper class for managing gas padding configuration
 */
export class GasPaddingManager {
    private options: Required<GasPaddingOptions>;

    constructor(options: GasPaddingOptions = {}) {
        validateGasPaddingOptions(options);
        this.options = { ...DEFAULT_GAS_PADDING_OPTIONS, ...options };
    }

    /**
     * Apply padding using the configured options
     */
    applyPadding(gasEstimate: number | bigint): number {
        return applyGasPadding(gasEstimate, this.options);
    }

    /**
     * Update the padding configuration
     */
    updateOptions(newOptions: Partial<GasPaddingOptions>): void {
        const mergedOptions = { ...this.options, ...newOptions };
        validateGasPaddingOptions(mergedOptions);
        this.options = mergedOptions;
    }

    /**
     * Get current configuration
     */
    getOptions(): Required<GasPaddingOptions> {
        return { ...this.options };
    }

    /**
     * Reset to default options
     */
    resetToDefaults(): void {
        this.options = { ...DEFAULT_GAS_PADDING_OPTIONS };
    }
}

/**
 * Example usage patterns for your specific use case:
 * 
 * // Method 1: Direct padding application
 * const rawGasEstimate = 100000; // From your gas estimation
 * const paddedGas = applyStandardPadding(rawGasEstimate); // 120000 (20% padding)
 * 
 * // Method 2: Custom padding
 * const paddedGas = applyGasPadding(rawGasEstimate, { 
 *   multiplier: 1.3,  // 30% padding
 *   fixedPadding: 5000 // Plus 5000 fixed
 * });
 * 
 * // Method 3: Using manager for consistent padding
 * const gasPadding = new GasPaddingManager({ multiplier: 1.25 });
 * const paddedGas = gasPadding.applyPadding(rawGasEstimate);
 * 
 * // For your specific transaction:
 * // 1. Get gas estimate however your current SDK does it
 * // 2. Apply padding: const paddedGas = applyStandardPadding(estimate);
 * // 3. Use paddedGas in your transaction
 */
