import { Revision } from "@vcdm";

/**
 * Options for gas estimation.
 */
interface EstimateGasOptions {
    /**
     * The revision (block) to estimate gas at.
     */
    revision?: Revision;

    /**
     * Gas padding percentage to add on top of estimated gas (0, 1].
     */
    gasPadding?: number;
}

export type { EstimateGasOptions };