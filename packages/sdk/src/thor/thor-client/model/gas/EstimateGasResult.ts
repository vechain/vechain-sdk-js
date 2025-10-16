/**
 * The result of estimating the gas cost of a transaction.
 */
interface EstimateGasResult {
    /**
     * The total gas cost estimation of the transaction.
     */
    totalGas: bigint;

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

export type { EstimateGasResult };
