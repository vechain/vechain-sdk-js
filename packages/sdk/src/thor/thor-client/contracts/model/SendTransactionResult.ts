/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor

import { type TransactionReceipt } from '../../model/transactions/TransactionReceipt';

/**
 * Send transaction result
 */
export interface SendTransactionResult {
    /**
     * The transaction ID (hash)
     */
    id: string;

    /**
     * Wait for the transaction to be confirmed and get the receipt
     * @returns Promise that resolves to the transaction receipt or null if not found
     */
    wait: () => Promise<TransactionReceipt | null>;
}
