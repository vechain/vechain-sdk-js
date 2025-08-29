interface EstimatedGas {
    /**
     * The gas used of the response.
     */
    readonly gasUsed: bigint;

    /**
     * The reverted of the response.
     */
    readonly reverted: boolean;

    /**
     * The VM error of the response.
     */
    readonly vmError: string;
}

export type { EstimatedGas };