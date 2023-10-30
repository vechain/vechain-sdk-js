import { type VMEvent, type VMTransfer } from './vm';

/**
 * Represents the model for a transaction.
 */
interface Transaction {
    id: string; // Transaction ID.
    chainTag: number; // Chain tag.
    blockRef: string; // Block reference.
    expiration: number; // Transaction expiration.
    clauses: Array<{
        to: string | null; // Recipient address (or null).
        value: string; // Value in hex string.
        data: string; // Transaction data in hex string.
    }>;
    gasPriceCoef: number; // Gas price coefficient.
    gas: number; // Gas limit.
    origin: string; // Transaction origin.
    delegator?: string | null; // Delegator address (or null).
    nonce: string; // Transaction nonce.
    dependsOn: string | null; // Dependent transaction ID (or null).
    size: number; // Transaction size.
    meta: {
        blockID: string; // Block ID.
        blockNumber: number; // Block number.
        blockTimestamp: number; // Block timestamp.
    };
}

/**
 * The transaction visitor interface for querying transactions and their receipts.
 */
interface TransactionVisitor {
    /**
     * The ID of the transaction to be visited.
     */
    readonly id: string;

    /**
     * Allows the queried transaction to be in a pending state. A pending transaction has a null 'meta'.
     * @returns The updated TransactionVisitor object.
     */
    allowPending: () => this;

    /**
     * Query the transaction.
     * @returns A promise that resolves to the transaction or null if not found.
     */
    get: () => Promise<Transaction | null>;

    /**
     * Query the transaction receipt.
     * @returns A promise that resolves to the transaction receipt or null if not found.
     */
    getReceipt: () => Promise<TransactionReceipt | null>;
}

/**
 * Represents the model for a transaction receipt.
 */
interface TransactionReceipt {
    gasUsed: number; // Gas used.
    gasPayer: string; // Gas payer's address.
    paid: string; // Amount paid in hex string.
    reward: string; // Transaction reward in hex string.
    reverted: boolean; // Indicates if the transaction was reverted.
    outputs: Array<{
        contractAddress: string | null; // Contract address (or null).
        events: VMEvent[]; // Array of virtual machine (VM) events.
        transfers: VMTransfer[]; // Array of virtual machine (VM) transfers.
    }>;
    meta: {
        blockID: string; // Block ID.
        blockNumber: number; // Block number.
        blockTimestamp: number; // Block timestamp.
        txID: string; // Transaction ID.
        txOrigin: string; // Transaction origin.
    };
}

export type { Transaction, TransactionVisitor, TransactionReceipt };
