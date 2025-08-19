import { type HexUInt32 } from '@vcdm';

/**
 * Type for target of TraceTransactionClause.
 */
export interface TransactionTraceTarget {
    /**
     * Block ID.
     */
    blockId: HexUInt32;
    /**
     * Clause index.
     */
    clauseIndex: number;
    /**
     * Transaction index if `number`, else ID if `ThorId`.
     */
    transaction: number | HexUInt32;
}
