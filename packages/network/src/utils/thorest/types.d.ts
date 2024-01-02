/* --- Input options start --- */

interface EventOptions {
    /**
     * The block id to start from, defaults to the best block.
     */
    position?: string;
    /**
     * The contract address to filter events by.
     */
    contractAddress?: string;
    /**
     * The topic0 to filter events by.
     */
    topic0?: string;
    /**
     * The topic1 to filter events by.
     */
    topic1?: string;
    /**
     * The topic2 to filter events by.
     */
    topic2?: string;
    /**
     * The topic3 to filter events by.
     */
    topic3?: string;
    /**
     * The topic4 to filter events by.
     */
    topic4?: string;
}

interface VetTransferOptions {
    /**
     * The block id to start from, defaults to the best block.
     */
    position?: string;
    /**
     * The signer address to filter transfers by.
     */
    signerAddress?: string;
    /**
     * The sender address to filter transfers by.
     */
    sender?: string;
    /**
     * The receiver address to filter transfers by.
     */
    receiver?: string;
}

/* --- Input options end --- */

export type { EventOptions, VetTransferOptions };
