/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor

import type {
    TransactionReceipt,
    WaitForTransactionReceiptOptions
} from '../../model/transactions';

/**
 * Send transaction result
 */
export interface SendTransactionResult {
    id: string;
    wait: (
        options?: WaitForTransactionReceiptOptions
    ) => Promise<TransactionReceipt | null>;
}
