/* --- Input options start --- */

import type { Transfer } from '../../thorest-client';

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

interface ClauseResult {
    reverted: boolean;
    data: string;
    estimatedGasUsed: number;
    events: Event[];
    transfers: Transfer[];
    vmError: string;
}

interface SendTransactionResult {
    id: string;
    clauseResults: ClauseResult[];
}

/* --- Input options end --- */

export type { WaitForTransactionOptions, SendTransactionResult, ClauseResult };
