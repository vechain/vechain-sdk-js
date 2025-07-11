import type { HardhatVeChainProvider } from '@vechain/sdk-network';
import type { TransactionRequest } from 'ethers';

/**
 * VeChain-specific transaction request that extends the ethers TransactionRequest
 */
export interface VeChainTransactionRequest extends TransactionRequest {
    gasPriceCoef?: number;
}

/**
 * Calculates the default max priority fee per gas based on the current base fee
 * and historical 75th percentile rewards.
 *
 * Uses the FAST (HIGH) speed threshold: min(0.046*baseFee, 75_percentile)
 *
 * @param provider - The hardhatVeChain provider
 * @param baseFee - The current base fee per gas
 * @returns A promise that resolves to the default max priority fee per gas as a bigint
 */
async function calculateDefaultMaxPriorityFeePerGas(
    provider: HardhatVeChainProvider,
    baseFee: bigint
): Promise<bigint> {
    // Get fee history for recent blocks
    const feeHistory = await provider.thorClient.gas.getFeeHistory({
        blockCount: 10,
        newestBlock: 'best',
        rewardPercentiles: [25, 50, 75] // Get 25th, 50th and 75th percentiles
    });

    // Get the 75th percentile reward from the most recent block
    let percentile75: bigint;

    if (
        feeHistory.reward !== null &&
        feeHistory.reward !== undefined &&
        feeHistory.reward.length > 0
    ) {
        const latestBlockRewards =
            feeHistory.reward[feeHistory.reward.length - 1];
        const equalRewardsOnLastBlock = new Set(latestBlockRewards).size === 3;

        // If rewards are equal in the last block, use the first one (75th percentile)
        // Otherwise, calculate the average of 75th percentiles across blocks
        if (equalRewardsOnLastBlock) {
            percentile75 = BigInt(latestBlockRewards[2]); // 75th percentile at index 2
        } else {
            // Calculate average of 75th percentiles across blocks
            let sum = 0n;
            let count = 0;

            for (const blockRewards of feeHistory.reward) {
                if (
                    blockRewards.length !== null &&
                    blockRewards.length > 2 &&
                    blockRewards[2] !== null &&
                    blockRewards[2] !== undefined
                ) {
                    sum += BigInt(blockRewards[2]);
                    count++;
                }
            }

            percentile75 = count > 0 ? sum / BigInt(count) : 0n;
        }
    } else {
        // Fallback to getMaxPriorityFeePerGas if fee history is not available
        percentile75 = BigInt(
            await provider.thorClient.gas.getMaxPriorityFeePerGas()
        );
    }

    // Calculate 4.6% of base fee (HIGH speed threshold)
    const baseFeeCap = (baseFee * 46n) / 1000n; // 0.046 * baseFee

    // Use the minimum of the two values
    return baseFeeCap < percentile75 ? baseFeeCap : percentile75;
}

/**
 * Adapts an ethers transaction request to a VeChain transaction request
 * Handles both legacy (gasPriceCoef) and Galactica fork (maxFeePerGas, maxPriorityFeePerGas) transaction types
 *
 * @param tx - The ethers transaction request to adapt
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted VeChain transaction request
 */
export async function adaptTransaction(
    tx: TransactionRequest,
    hardhatVeChainProvider: HardhatVeChainProvider
): Promise<VeChainTransactionRequest> {
    // Check if Galactica fork has happened
    const galacticaHappened =
        await hardhatVeChainProvider.thorClient.forkDetector.isGalacticaForked(
            'best'
        );

    // If maxFeePerGas or maxPriorityFeePerGas is set, ensure Galactica fork has happened
    if (
        !galacticaHappened &&
        (tx.maxFeePerGas !== undefined || tx.maxPriorityFeePerGas !== undefined)
    ) {
        throw new Error(
            'Dynamic fee transaction (maxFeePerGas/maxPriorityFeePerGas) is not allowed before Galactica fork'
        );
    }

    // Check for invalid parameter combinations
    const hasMaxFeePerGas = tx.maxFeePerGas !== undefined;
    const hasMaxPriorityFeePerGas = tx.maxPriorityFeePerGas !== undefined;
    const hasGasPrice = tx.gasPrice !== undefined;

    // Case 3: maxPriorityFeePerGas + gasPriceCoef (error)
    if (hasMaxPriorityFeePerGas && hasGasPrice && !hasMaxFeePerGas) {
        throw new Error(
            'Invalid parameter combination: maxPriorityFeePerGas and gasPrice cannot be used together without maxFeePerGas'
        );
    }

    // Case 4: maxFeePerGas + gasPriceCoef (error)
    if (hasMaxFeePerGas && hasGasPrice && !hasMaxPriorityFeePerGas) {
        throw new Error(
            'Invalid parameter combination: maxFeePerGas and gasPrice cannot be used together without maxPriorityFeePerGas'
        );
    }

    // Case 1: maxPriorityFeePerGas + maxFeePerGas + gasPriceCoef (only 1 and 2 are used)
    if (hasMaxPriorityFeePerGas && hasMaxFeePerGas && hasGasPrice) {
        return {
            ...tx,
            gasPriceCoef: undefined,
            gasPrice: undefined
        };
    }

    // Case 2: maxPriorityFeePerGas + maxFeePerGas (1 and 2 are used)
    if (hasMaxPriorityFeePerGas && hasMaxFeePerGas) {
        return {
            ...tx,
            gasPriceCoef: undefined,
            gasPrice: undefined
        };
    }

    // Case 5: gasPriceCoef only (3 is used - legacy transaction)
    if (hasGasPrice && !hasMaxPriorityFeePerGas && !hasMaxFeePerGas) {
        return {
            ...tx,
            gasPriceCoef: Number(tx.gasPrice),
            gasPrice: undefined,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined
        };
    }

    // If Galactica hasn't happened and no gasPriceCoef is set, use default of 0
    if (!galacticaHappened && !hasGasPrice) {
        return {
            ...tx,
            gasPriceCoef: 0
        };
    }

    // If Galactica has happened and no dynamic fees are set, calculate them
    if (galacticaHappened && !hasMaxFeePerGas && !hasMaxPriorityFeePerGas) {
        const bestBlockBaseFeePerGas =
            await hardhatVeChainProvider.thorClient.blocks.getBestBlockBaseFeePerGas();
        if (
            bestBlockBaseFeePerGas === null ||
            bestBlockBaseFeePerGas === undefined
        ) {
            throw new Error('Unable to get best block base fee per gas');
        }

        const baseFee = BigInt(bestBlockBaseFeePerGas);
        const maxPriorityFeePerGas = await calculateDefaultMaxPriorityFeePerGas(
            hardhatVeChainProvider,
            baseFee
        );

        // Calculate maxFeePerGas as baseFee + maxPriorityFeePerGas
        const maxFeePerGas = baseFee + maxPriorityFeePerGas;

        return {
            ...tx,
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasPriceCoef: undefined
        };
    }

    // For Galactica transactions with dynamic fees, ensure both maxFeePerGas and maxPriorityFeePerGas are set
    if (galacticaHappened && (hasMaxFeePerGas || hasMaxPriorityFeePerGas)) {
        if (!hasMaxFeePerGas || !hasMaxPriorityFeePerGas) {
            throw new Error(
                'Both maxFeePerGas and maxPriorityFeePerGas must be set for dynamic fee transactions'
            );
        }
        return {
            ...tx,
            maxFeePerGas: tx.maxFeePerGas,
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
            gasPriceCoef: undefined,
            gasPrice: undefined
        };
    }

    // Return the transaction as is if no fee-related fields need to be modified
    return tx as VeChainTransactionRequest;
}
