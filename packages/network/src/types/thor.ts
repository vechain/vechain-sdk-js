import { type Block, type BlockVisitor } from './block';
import { type TransactionVisitor } from './transaction';
import { type VMClause, type VMExplainer } from './vm';
import { type ThorFilter, type FilterCriteria } from './filter';
import { type AccountVisitor } from './account';

/**
 * The `Thor` interface represents the Thor module, providing access to VeChain accounts, blocks, transactions, logs, and more.
 */
interface Thor {
    /**
     * The genesis block of the blockchain.
     */
    readonly genesis: Block;

    /**
     * The current status of the VeChain network.
     */
    readonly status: ThorStatus;

    /**
     * Create a ticker to watch for new blocks.
     * @returns A Ticker object for monitoring new block events.
     */
    ticker: () => Ticker;

    /**
     * Create a visitor for the account specified by the given address.
     * @param addr - The account address.
     * @returns An AccountVisitor for interacting with the account.
     */
    account: (addr: string) => AccountVisitor;

    /**
     * Create a visitor for the block specified by the given revision (block ID or number).
     * @param revision - (Optional) The block ID or number (defaults to the current value of status.head.id).
     * @returns A BlockVisitor for accessing block information.
     */
    block: (revision?: string | number) => BlockVisitor;

    /**
     * Create a visitor for the transaction specified by the given transaction ID.
     * @param id - The transaction ID.
     * @returns A TransactionVisitor for interacting with the transaction.
     */
    transaction: (id: string) => TransactionVisitor;

    /**
     * Create an event logs filter with specified criteria.
     * @param kind - The kind of filter ('event').
     * @param criteria - An array of criteria for filtering events.
     * @returns A ThorFilter for event logs filtering.
     */
    filterEvent: (
        kind: 'event',
        criteria: Array<FilterCriteria<'event'>>
    ) => ThorFilter<'event'>;

    /**
     * Create a transfer logs filter with specified criteria.
     * @param kind - The kind of filter ('transfer').
     * @param criteria - An array of criteria for filtering transfers.
     * @returns A ThorFilter for transfer logs filtering.
     */
    filterTransfer: (
        kind: 'transfer',
        criteria: Array<FilterCriteria<'transfer'>>
    ) => ThorFilter<'transfer'>;

    /**
     * Create an explainer to simulate the execution of a transaction.
     * @param clauses - An array of VM clauses representing the transaction.
     * @returns A VMExplainer for simulating transaction execution.
     */
    explain: (clauses: VMClause[]) => VMExplainer;
}

/**
 * Describes the status of the VeChain network.
 */
interface ThorStatus {
    /**
     * The progress of synchronization, ranging from 0 to 1. A value of 1 indicates full synchronization.
     */
    progress: number;

    /**
     * Summary of the head block.
     */
    head: {
        id: string; // Block ID.
        number: number; // Block number.
        timestamp: number; // Block timestamp.
        parentID: string; // Parent block ID.
        txsFeatures?: number; // Bits of supported transaction features.
        gasLimit: number; // Block gas limit.
    };

    /**
     * ID of the finalized block.
     */
    finalized: string;
}

/**
 * The `Ticker` interface is used to watch for new blocks on the blockchain.
 */
interface Ticker {
    /**
     * Returns a promise of the new head block summary, which is resolved once a new block is produced.
     * @returns A promise that resolves to the head block summary.
     */
    next: () => Promise<ThorStatus['head']>;
}

export type { Thor, ThorStatus };
