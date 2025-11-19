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
export declare function adaptTransaction(tx: TransactionRequest, hardhatVeChainProvider: HardhatVeChainProvider): Promise<VeChainTransactionRequest>;
//# sourceMappingURL=transaction-adapter.d.ts.map