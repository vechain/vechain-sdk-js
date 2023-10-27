/**
 * Represents a block on the blockchain.
 */
interface Block {
    id: string; // The unique identifier of the block.
    number: number; // The block number in the blockchain.
    size: number; // The size of the block.
    parentID: string; // The identifier of the parent block.
    timestamp: number; // The timestamp when the block was created.
    gasLimit: number; // The gas limit for transactions in the block.
    beneficiary: string; // The address of the beneficiary.
    gasUsed: number; // The amount of gas used in the block.
    totalScore: number; // The total score of the block.
    txsRoot: string; // The root of the transactions in the block.
    txsFeatures?: number; // (Optional) Features of the transactions.
    stateRoot: string; // The root of the blockchain state.
    receiptsRoot: string; // The root of the transaction receipts.
    signer: string; // The signer's address.
    transactions: string[]; // An array of transaction identifiers.
    com?: boolean; // (Optional) Indicator of whether the block is committed.
    isFinalized?: boolean; // (Optional) Indicator of whether the block is finalized.
    isTrunk: boolean; // Indicator of whether the block is part of the trunk.
}

/**
 * Represents a block visitor interface for querying blocks.
 */
interface BlockVisitor {
    revision: string | number; // The identifier or number of the block to be visited.

    /**
     * Retrieves the block based on the provided revision.
     * @returns A promise that resolves to the requested block or null if not found.
     */
    get: () => Promise<Block | null | undefined>;
}

export type { Block, BlockVisitor };
