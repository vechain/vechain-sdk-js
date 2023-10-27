import { type VMEvent, type VMTransfer } from './vm';

/** the filter interface, to filter event/transfer logs */
interface ThorFilter<T extends 'event' | 'transfer', E = unknown> {
    /** set range */
    range: (range: FilterRange) => this;

    /** set sort order */
    order: (order: 'asc' | 'desc') => this;

    /**
     * turn on result cache
     * @param hints a set of addresses, as the condition of cache invalidation
     */
    cache: (hints: string[]) => this;

    /** do query */
    apply: (offset: number, limit: number) => Promise<Array<FilterRow<T, E>>>;
}

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

interface FilterRange {
    unit: 'block' | 'time';
    from: number;
    to: number;
}

interface FilterWithMeta {
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        txID: string;
        txOrigin: string;
        clauseIndex: number;
    };
}

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
