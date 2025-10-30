/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor

/**
 * Send transaction result
 */
export interface SendTransactionResult {
    id: string;
    wait: () => Promise<{ id: string; blockNumber: number; blockHash: string }>;
}
