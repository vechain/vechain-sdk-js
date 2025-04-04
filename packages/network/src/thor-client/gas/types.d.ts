import { type SimulateTransactionOptions } from '../transactions/types';

/* --- Input options start --- */

type EstimateGasOptions = Omit<SimulateTransactionOptions, 'caller'> & {
    /**
     * percentage of gas to add on top of the estimated gas.
     * Value must be between (0, 1]. (e.g. 0.1 = 10%)
     */
    gasPadding?: number;
};

/**
 * Options for the getFeeHistory method
 */
interface FeeHistoryOptions {
    /**
     * Number of blocks in the requested range
     */
    blockCount: number;
    
    /**
     * Highest block of the requested range
     */
    newestBlock: string | number;
    
    /**
     * Optional array of percentiles to compute
     */
    rewardPercentiles?: number[];
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

/**
 * Response from the /fees/priority endpoint
 */
interface FeesPriorityResponse {
    /**
     * The suggested priority fee per gas in wei (hex string)
     */
    maxPriorityFeePerGas: string;
}

/**
 * Response from the eth_feeHistory method
 */
interface FeeHistoryResponse {
    /**
     * Lowest number block of the returned range
     */
    oldestBlock: string;
    
    /**
     * An array of block base fee per gas
     */
    baseFeePerGas: string[];
    
    /**
     * An array of block gas used ratio
     */
    gasUsedRatio: string[];
    
    /**
     * An array of effective priority fee per gas data points from a single block
     */
    reward?: string[][];
}

/* --- Responses Outputs end --- */

export type { 
    EstimateGasResult, 
    EstimateGasOptions, 
    FeesPriorityResponse,
    FeeHistoryResponse,
    FeeHistoryOptions
};
