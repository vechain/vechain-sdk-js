import type { Hex } from '@vcdm';

interface FeeHistory {
    /**
     * The VeChain block identifier of the oldest block in the response.
     */
    readonly oldestBlock: Hex;

    /**
     * An array of base fees per block as hexadecimal strings. They will be 0x0 for blocks previous to the Galactic fork.
     */
    readonly baseFeePerGas: bigint[];

    /**
     * An array of gas used ratios per block as float numbers.
     */
    readonly gasUsedRatio: number[];

    /**
     * An array of arrays of rewards by the percentiles provided in the request via rewardPercentiles.
     * Each inner array contains the reward values for each percentile requested.
     */
    readonly reward: bigint[][];
}

export type { FeeHistory };
