import type { HardhatVeChainProvider } from '@vechain/sdk-network';
import type { TransactionRequest } from 'ethers';

/**
 * VeChain-specific transaction request that extends the ethers TransactionRequest
 */
export interface VeChainTransactionRequest extends TransactionRequest {
    gasPriceCoef?: number;
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

    // If Galactica hasn't happened and no gasPriceCoef is set, use default of 0
    if (!galacticaHappened && tx.gasPrice === undefined) {
        return {
            ...tx,
            gasPriceCoef: 0
        };
    }

    // If Galactica has happened and no dynamic fees are set, calculate them
    if (
        galacticaHappened &&
        tx.maxFeePerGas === undefined &&
        tx.maxPriorityFeePerGas === undefined
    ) {
        const bestBlockBaseFeePerGas =
            await hardhatVeChainProvider.thorClient.blocks.getBestBlockBaseFeePerGas();
        if (
            bestBlockBaseFeePerGas === null ||
            bestBlockBaseFeePerGas === undefined
        ) {
            throw new Error('Unable to get best block base fee per gas');
        }

        // Calculate maxPriorityFeePerGas based on fee history
        const maxPriorityFeePerGas =
            await hardhatVeChainProvider.thorClient.gas.getMaxPriorityFeePerGas();

        // Calculate maxFeePerGas as baseFee + maxPriorityFeePerGas
        const maxFeePerGas =
            BigInt(bestBlockBaseFeePerGas) + BigInt(maxPriorityFeePerGas);

        return {
            ...tx,
            maxFeePerGas,
            maxPriorityFeePerGas: BigInt(maxPriorityFeePerGas),
            gasPriceCoef: undefined
        };
    }

    // For legacy transactions (pre-Galactica), convert gasPrice to gasPriceCoef
    if (!galacticaHappened && tx.gasPrice !== undefined) {
        return {
            ...tx,
            gasPriceCoef: Number(tx.gasPrice),
            gasPrice: undefined
        };
    }

    // For Galactica transactions with dynamic fees, ensure both maxFeePerGas and maxPriorityFeePerGas are set
    if (
        galacticaHappened &&
        (tx.maxFeePerGas !== undefined || tx.maxPriorityFeePerGas !== undefined)
    ) {
        if (
            tx.maxFeePerGas === undefined ||
            tx.maxPriorityFeePerGas === undefined
        ) {
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
