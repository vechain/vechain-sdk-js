interface Status {
    /** progress of synchronization. From 0 to 1, 1 means fully synchronized. */
    progress: number;
    /** summary of head block */
    head: {
        /** block id */
        id: string;
        /** block number */
        number: number;
        /** block timestamp */
        timestamp: number;
        /** parent block id */
        parentID: string;
        /** bits of supported txs features */
        txsFeatures?: number;
        /** block gas limit */
        gasLimit: number;
    };
    /** id of finalized block */
    finalized: string;
}

export type { Status };
