import { type ThorId } from '@vechain/sdk-core';

/**
 * Type for target of TraceTransactionClause.
 */
export interface TransactionTraceTarget {
    /**
     * Block ID.
     */
    blockID: ThorId;
    /**
     * Transaction index if `number`, else ID if `ThorId`.
     */
    transaction: number | ThorId;
    /**
     * Clause index.
     */
    clauseIndex: number;
}
