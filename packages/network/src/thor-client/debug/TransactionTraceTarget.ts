/**
 * Type for target of TraceTransactionClause.
 */
export interface TransactionTraceTarget {
    /**
     * Block ID.
     */
    blockID: string;
    /**
     * Transaction ID or Transaction index.
     */
    transaction: number | string;
    /**
     * Clause index.
     */
    clauseIndex: number;
}
