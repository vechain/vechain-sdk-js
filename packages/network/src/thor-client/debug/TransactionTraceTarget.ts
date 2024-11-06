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
     * Transaction ID or Transaction index.
     */
    transaction: number | ThorId;
    /**
     * Clause index.
     */
    clauseIndex: number;
}
