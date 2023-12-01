/* --- Input options start --- */

import type { TransactionSimulationResult } from '../../thorest-client';

/**
 * Options for `waitForTransaction` method.
 */
interface WaitForTransactionOptions {
    /**
     * Timeout in milliseconds.
     * After this time, the method will throw an error.
     */
    timeoutMs?: number;
    /**
     * Interval in milliseconds.
     * The method will check the transaction status every `intervalMs` milliseconds.
     */
    intervalMs?: number;
}

interface SendTransactionResult {
    id: string;
    clausesResults: TransactionSimulationResult[];
}

/* --- Input options end --- */

export type { WaitForTransactionOptions, SendTransactionResult };
