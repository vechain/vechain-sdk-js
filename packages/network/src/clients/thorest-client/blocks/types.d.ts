/* --- Input options start --- */

import { type Event, type Transfer } from '../logs';

/**
 * Input options for:
 * * getAccount
 * * getBytecode
 * * getStorage
 * Methods
 *
 * @public
 */
interface BlockInputOptions {
    /**
     * (Optional) Whether the returned block is expanded.
     */
    expanded?: boolean;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

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

/**
 * Clauses represent the individual conditions or terms in a blockchain transaction.
 */
type Clauses = Array<{
    to: string;
    value: string;
    data: string;
}>;

/**
 * Outputs represent the results or consequences of a blockchain transaction.
 */
type Outputs = Array<{
    contractAddress: string | null;
    events: Event[];
    transfers: Transfer[];
}>;

/**
 * TransactionsExpandedBlockDetail is an interface representing detailed information about transactions in a blockchain block.
 */
interface TransactionsExpandedBlockDetail {
    // Unique identifier for the transaction.
    id: string;

    // Chain tag of the blockchain.
    chainTag: string;

    // Reference to the block.
    blockRef: string;

    // Expiration timestamp of the transaction.
    expiration: number;

    // Clauses represent the individual conditions or terms in a blockchain transaction.
    clauses: Clauses;

    // Gas price coefficient for the transaction.
    gasPriceCoef: number;

    // Gas limit for the transaction.
    gas: number;

    // Origin (sender) of the transaction.
    origin: string;

    // Delegator associated with the transaction.
    delegator: string;

    // Nonce value for preventing replay attacks.
    nonce: string;

    // Transaction dependency.
    dependsOn: string;

    // Size of the transaction in bytes.
    size: number;

    // Gas used by the transaction.
    gasUsed: number;

    // Account paying for the gas.
    gasPayer: string;

    // Amount paid for the transaction.
    paid: string;

    // Reward associated with the transaction.
    reward: string;

    // Indicates if the transaction is reverted.
    reverted: boolean;

    // Outputs represent the results or consequences of a blockchain transaction.
    outputs: Outputs;
}

/* --- Responses Outputs end --- */

export {
    type BlockInputOptions,
    type BlockDetail,
    type TransactionsExpandedBlockDetail
};
