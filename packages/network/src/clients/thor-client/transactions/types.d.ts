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

/**
 * Represents the result of sending a transaction.
 *
 * @interface SendTransactionResult
 */
interface SendTransactionResult {
    /**
     * The unique identifier associated with the transaction.
     *
     * @type {string}
     */
    id: string;

    /**
     * An array of results for each clause in the transaction.
     *
     * @type {TransactionSimulationResult[]}
     */
    clausesResults: TransactionSimulationResult[];
}

/* --- Input options end --- */

export type { WaitForTransactionOptions, SendTransactionResult };
