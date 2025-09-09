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

    /**
     * The transfers of the response.
     */
    transfers?: {
        sender: string;
        recipient: string;
        amount: string;
    }[];

    /**
     * The events of the response.
     */
    events?: {
        address: string;
        topics: string[];
        data: string;
    }[];
}

export type { EstimatedGas };