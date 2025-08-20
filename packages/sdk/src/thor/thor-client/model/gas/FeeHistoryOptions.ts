import { Revision } from "@vcdm";

/**
 * Options for retrieving fee history.
 */
interface FeeHistoryOptions {
    /**
     * The number of blocks to return fee history for.
     */
    blockCount: number;

    /**
     * The newest block to include in the fee history.
     * Can be a block number, block ID, or special values like "best", "finalized", "next".
     */
    newestBlock?: Revision | null;

    /**
     * Array of percentiles (0-100) to calculate reward values for.
     */
    rewardPercentiles?: number[];
}

export type { FeeHistoryOptions };