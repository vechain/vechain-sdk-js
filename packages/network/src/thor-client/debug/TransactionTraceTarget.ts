import { type BlockId } from '@vechain/sdk-core';

/**
 * Type for target of TraceTransactionClause.
 */
export interface TransactionTraceTarget {
    /**
     * Block ID.
     */
    blockID: BlockId;
    /**
     * Transaction index if `number`, else ID if `ThorId`.
     */
    transaction: number | BlockId;
    /**
     * Clause index.
     */
    clauseIndex: number;
}