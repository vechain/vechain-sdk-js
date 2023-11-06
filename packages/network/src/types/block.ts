/**
 * Represents a blockchain block
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

export type { Block };
