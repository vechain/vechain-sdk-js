import { type SimulateTransactionOptions } from '../transactions';

/* --- Input options start --- */

type EstimateGasOptions = Omit<SimulateTransactionOptions, 'caller'> & {
    /**
     * percentage of gas to add on top of the estimated gas.
     * Value must be between (0, 1]. (e.g. 0.1 = 10%)
     */
    gasPadding?: number;
};

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

export type { EstimateGasResult, EstimateGasOptions };
