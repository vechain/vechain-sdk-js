/**
 * Represents a blockchain account.
 *
 * This interface defines the structure of a blockchain account, including its balance, energy, and whether it has associated code.
 *
 * @public
 */
interface Account {
    // Balance of the account in VET as a hexadecimal string
    balance: string;

    // Energy of the account in VTHO as a hexadecimal string
    energy: string;

    // Indicates whether the account has associated code
    hasCode: boolean;
}

/**
 * Represents a blockchain block.
 *
 * This interface defines the structure of a blockchain block, including its properties such as ID, number, size, timestamp, and more.
 *
 * @public
 */
interface Block {
    // Unique identifier for the block
    id: string;

    // Block number in the blockchain
    number: number;

    // Size of the block in bytes
    size: number;

    // Identifier of the parent block
    parentID: string;

    // Timestamp when the block was created
    timestamp: number;

    // Gas limit for the block
    gasLimit: number;

    // Address of the beneficiary (miner) who created the block
    beneficiary: string;

    // Gas used in the block
    gasUsed: number;

    // Total score associated with the block
    totalScore: number;

    // Root of the transactions Merkle tree
    txsRoot: string;

    // Optional field for transaction features
    txsFeatures?: number;

    // Root of the state tree
    stateRoot: string;

    // Root of the receipts Merkle tree
    receiptsRoot: string;

    // Address of the signer who proposed the block
    signer: string;

    // Array of transaction identifiers included in the block
    transactions: string[];

    // Optional field to indicate if the block contains communication data
    com?: boolean;

    // Optional field to indicate if the block is finalized
    isFinalized?: boolean;

    // Flag to indicate if the block is on the main trunk of the blockchain
    isTrunk: boolean;
}

/**
 * Represents the status of blockchain synchronization.
 *
 * This interface defines the structure of blockchain synchronization status, including progress, head block, and finalized block.
 *
 * @public
 */
interface Status {
    /**
     * Progress of blockchain synchronization, ranging from 0 to 1 where 1 indicates full synchronization.
     */
    progress: number;

    /**
     * Summary of the head block.
     */
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
     * Identifier of the finalized block.
     */
    finalized: string;
}

export type { Account, Block, Status };
