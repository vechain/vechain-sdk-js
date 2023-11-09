/**
 * BlockDetail is an interface representing detailed information about a blockchain block.
 */
interface BlockDetail {
    // Unique identifier for the block.
    id: string;

    // Block number in the blockchain.
    number: number;

    // Size of the block in bytes.
    size: number;

    // Identifier of the parent block.
    parentID: string;

    // Timestamp when the block was created.
    timestamp: number;

    // Maximum gas limit for transactions in the block.
    gasLimit: number;

    // Address of the beneficiary (miner) of the block.
    beneficiary: string;

    // Total gas used by transactions in the block.
    gasUsed: number;

    // Total score associated with the block.
    totalScore: number;

    // Root hash of the transactions in the block.
    txsRoot: string;

    // Optional features associated with transactions.
    txsFeatures?: number;

    // Root hash of the state tree after applying transactions.
    stateRoot: string;

    // Root hash of the receipts of transactions.
    receiptsRoot: string;

    // Address of the signer or validator for the block.
    signer: string;

    // Array of transaction IDs or hashes in the block.
    transactions: string[];

    // Indicates if the block contains a community fund (com).
    com?: boolean;

    // Indicates if the block is finalized (optional).
    isFinalized?: boolean;

    // Indicates if the block is part of the blockchain trunk.
    isTrunk: boolean;
}

export type { BlockDetail };
