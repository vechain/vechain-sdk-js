/**
 * Represents the status of blockchain synchronization
 */
interface Status {
    /**
     * Progress of blockchain synchronization, ranging from 0 to 1 where 1 indicates full synchronization.
     * */
    progress: number;

    /**
     * Summary of the head block
     * */
    head: {
        // Unique identifier for the head block
        id: string;

        // Block number of the head block
        number: number;

        // Timestamp of the head block
        timestamp: number;

        // Identifier of the parent block of the head block
        parentID: string;

        // Optional bits representing supported transaction features in the head block
        txsFeatures?: number;

        // Gas limit of the head block
        gasLimit: number;
    };

    /**
     * Identifier of the finalized block
     * */
    finalized: string;
}

export type { Status };
