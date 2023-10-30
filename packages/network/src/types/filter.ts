import { type VMEvent, type VMTransfer } from './vm';

/**
 * Represents an interface for filtering event and transfer logs.
 */
interface ThorFilter<T extends 'event' | 'transfer', E = unknown> {
    /**
     * Set the filter range based on unit, from, and to values.
     * @param range - The filter range details.
     * @returns The updated ThorFilter object.
     */
    range: (range: FilterRange) => this;

    /**
     * Set the sort order of the filter results.
     * @param order - The sort order ('asc' for ascending, 'desc' for descending).
     * @returns The updated ThorFilter object.
     */
    order: (order: 'asc' | 'desc') => this;

    /**
     * Enable result caching with specified cache invalidation hints.
     * @param hints - A set of addresses as cache invalidation conditions.
     * @returns The updated ThorFilter object.
     */
    cache: (hints: string[]) => this;

    /**
     * Execute the filter query with an offset and limit.
     * @param offset - The offset for query results.
     * @param limit - The maximum number of results to retrieve.
     * @returns A promise that resolves to an array of filter rows.
     */
    apply: (offset: number, limit: number) => Promise<Array<FilterRow<T, E>>>;
}

/**
 * Represents criteria for filtering events and transfers.
 */
type FilterCriteria<T extends 'event' | 'transfer'> = T extends 'event'
    ? {
          address?: string;
          topic0?: string;
          topic1?: string;
          topic2?: string;
          topic3?: string;
          topic4?: string;
      }
    : T extends 'transfer'
    ? {
          txOrigin?: string;
          sender?: string;
          recipient?: string;
      }
    : never;

/**
 * Represents the range of a filter, specifying the unit, from, and to values.
 */
interface FilterRange {
    unit: 'block' | 'time'; // The unit of the filter range ('block' or 'time').
    from: number; // The starting value of the range.
    to: number; // The ending value of the range.
}

/**
 * Represents a filter with associated metadata.
 */
interface FilterWithMeta {
    meta: {
        blockID: string; // The block's unique identifier.
        blockNumber: number; // The block's number.
        blockTimestamp: number; // The block's timestamp.
        txID: string; // The transaction's unique identifier.
        txOrigin: string; // The transaction's origin.
        clauseIndex: number; // The index of the clause.
    };
}

/**
 * Represents a filter row that includes event or transfer data along with metadata.
 */
type FilterRow<T extends 'event' | 'transfer', E = unknown> = (T extends 'event'
    ? VMEvent
    : T extends 'transfer'
    ? VMTransfer
    : never) &
    FilterWithMeta &
    E;

export type {
    ThorFilter,
    FilterCriteria,
    FilterRange,
    FilterWithMeta,
    FilterRow
};
