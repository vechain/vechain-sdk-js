/* --- Input options start --- */

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

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * The result of estimating the gas cost of a transaction.
 */
interface EstimateGasResult {
    /**
     * The total gas cost estimation of the transaction.
     */
    totalGas: number;

    /**
     * Boolean indicating whether the transaction reverted or not.
     */
    reverted: boolean;

    /**
     * Decoded Solidity revert reasons for each clause.
     * If the n-th clause reverted, then the n-th element of this array will be the decoded revert reason for the n-th clause.
     *
     * @note revertReasons will be undefined if the transaction did not revert.
     */
    revertReasons: Array<string | bigint>;

    /**
     * The error message produced by the Virtual Machine.
     *
     * @note vmErrors will be undefined if the transaction did not revert.
     */
    vmErrors: string[];
}

/* --- Responses Outputs end --- */

export type { WaitForTransactionOptions, EstimateGasResult };
