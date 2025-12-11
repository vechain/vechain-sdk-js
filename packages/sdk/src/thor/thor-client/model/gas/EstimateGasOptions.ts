import { type RevisionLike } from '@common/vcdm';

/**
 * Options for gas estimation.
 */
interface EstimateGasOptions {
    /**
     * The revision (block) to estimate gas at.
     * Accepts a Revision instance, block number (number/bigint), or string alias ('best', 'finalized', etc.)
     */
    revision?: RevisionLike;

    /**
     * The maximum gas to use for the transaction.
     * If not provided, the transaction will be simulated with the gas limit of the chain.
     */
    gas?: bigint;

    /**
     * The gas price to use for the transaction.
     * If not provided, the transaction will be simulated with the gas price of the chain.
     */
    gasPrice?: bigint;

    /**
     * Gas padding percentage to add on top of estimated gas (0, 1].
     */
    gasPadding?: number;
}

export type { EstimateGasOptions };
