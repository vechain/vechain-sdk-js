import { type Block } from '@thor';
import { type Address } from '@vcdm';

/**
 * Utility class for calculating dynamic fees based on EIP-1559 logic
 * adapted for VeChain's fee structure.
 */
class DynamicFeeCalculator {
    /**
     * Calculates the effective gas price for a transaction based on base fee and priority fee.
     * 
     * @param baseFeePerGas - The base fee per gas from the block
     * @param maxFeePerGas - The maximum fee per gas the sender is willing to pay
     * @param maxPriorityFeePerGas - The maximum priority fee per gas (tip)
     * @returns The effective gas price to use for the transaction
     */
    public static calculateEffectiveGasPrice(
        baseFeePerGas: bigint,
        maxFeePerGas: bigint,
        maxPriorityFeePerGas: bigint
    ): bigint {
        // Ensure maxFeePerGas is at least baseFeePerGas
        if (maxFeePerGas < baseFeePerGas) {
            throw new Error(`maxFeePerGas (${maxFeePerGas}) is less than baseFeePerGas (${baseFeePerGas})`);
        }

        // Calculate the maximum priority fee we can afford
        const maxAffordablePriorityFee = maxFeePerGas - baseFeePerGas;
        
        // Use the minimum of requested priority fee and what we can afford
        const actualPriorityFee = maxPriorityFeePerGas < maxAffordablePriorityFee 
            ? maxPriorityFeePerGas 
            : maxAffordablePriorityFee;

        return baseFeePerGas + actualPriorityFee;
    }

    /**
     * Suggests dynamic fee parameters based on current network conditions.
     * 
     * @param block - The current block to base calculations on
     * @param priorityLevel - Priority level: 'slow', 'standard', 'fast'
     * @returns Suggested maxFeePerGas and maxPriorityFeePerGas
     */
    public static suggestDynamicFees(
        block: Block,
        priorityLevel: 'slow' | 'standard' | 'fast' = 'standard'
    ): { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint } {
        const baseFeePerGas = block.baseFeePerGas ?? 0n;
        
        // Priority fee multipliers based on desired inclusion speed
        const priorityMultipliers = {
            slow: 1.1,     // 10% above base
            standard: 1.5, // 50% above base  
            fast: 2.0      // 100% above base
        };

        const multiplier = priorityMultipliers[priorityLevel];
        
        // Calculate suggested priority fee (tip to validators)
        const suggestedPriorityFee = BigInt(Math.floor(Number(baseFeePerGas) * (multiplier - 1)));
        
        // Calculate max fee with buffer for base fee fluctuation
        // Allow for 12.5% base fee increase per block (EIP-1559 max)
        const baseFeeBuffer = baseFeePerGas / 8n; // 12.5% buffer
        const maxFeePerGas = baseFeePerGas + baseFeeBuffer + suggestedPriorityFee;

        return {
            maxFeePerGas,
            maxPriorityFeePerGas: suggestedPriorityFee
        };
    }

    /**
     * Validates dynamic fee parameters to ensure they are reasonable.
     * 
     * @param maxFeePerGas - The maximum fee per gas
     * @param maxPriorityFeePerGas - The maximum priority fee per gas
     * @param baseFeePerGas - The current base fee per gas
     * @throws Error if parameters are invalid
     */
    public static validateDynamicFees(
        maxFeePerGas: bigint,
        maxPriorityFeePerGas: bigint,
        baseFeePerGas: bigint
    ): void {
        if (maxFeePerGas < baseFeePerGas) {
            throw new Error(`maxFeePerGas (${maxFeePerGas}) must be at least baseFeePerGas (${baseFeePerGas})`);
        }

        if (maxPriorityFeePerGas < 0n) {
            throw new Error(`maxPriorityFeePerGas (${maxPriorityFeePerGas}) cannot be negative`);
        }

        if (maxFeePerGas < maxPriorityFeePerGas) {
            throw new Error(`maxFeePerGas (${maxFeePerGas}) must be at least maxPriorityFeePerGas (${maxPriorityFeePerGas})`);
        }
    }

    /**
     * Converts legacy gasPriceCoef to dynamic fee parameters.
     * 
     * @param gasPriceCoef - The legacy gas price coefficient
     * @param baseFeePerGas - The current base fee per gas
     * @returns Equivalent dynamic fee parameters
     */
    public static convertLegacyToEIP1559(
        gasPriceCoef: bigint,
        baseFeePerGas: bigint
    ): { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint } {
        // VeChain's gas price calculation: gasPrice = baseFeePerGas * (gasPriceCoef + 1) / 256
        const legacyGasPrice = (baseFeePerGas * (gasPriceCoef + 1n)) / 256n;
        
        // Set maxFeePerGas to the legacy gas price
        const maxFeePerGas = legacyGasPrice;
        
        // Calculate priority fee as the difference
        const maxPriorityFeePerGas = legacyGasPrice > baseFeePerGas 
            ? legacyGasPrice - baseFeePerGas 
            : 0n;

        return { maxFeePerGas, maxPriorityFeePerGas };
    }
}

export { DynamicFeeCalculator };
