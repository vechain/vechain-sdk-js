/* --- Input options start --- */

import type { EventFragment, Result } from '@vechain/sdk-core';

/**
 * Range interface for specifying a range of data.
 */
interface Range {
    /**
     * The unit for specifying the range (block or time).
     */
    unit?: 'block' | 'time'; // The unit for specifying the range (block or time).

    /**
     * The starting point of the range.
     */
    from?: number;

    /**
     * The ending point of the range.
     */
    to?: number;
}

/**
 * Options interface for specifying Pagination Options (offset and limits).
 */
interface PaginationOptions {
    /**
     * Offset for pagination.
     */
    offset?: number;

    /**
     * Limit for the number of results to return.
     */
    limit?: number;
}

/**
 * FilterCriteria interface for filtering event logs.
 */
interface FilterCriteria {
    criteria: EventCriteria;
    eventFragment: EventFragment;
}

/**
 * EventCriteria interface for filtering event logs.
 */
interface EventCriteria {
    /**
     * Address filter for event criteria.
     */
    address?: string;
    /**
     * Event topics filter.
     */
    topic0?: string;
    topic1?: string;
    topic2?: string;
    topic3?: string;
    topic4?: string;
}

/**
 * Order interface for filtering event logs.
 */
type EventDisplayOrder = 'asc' | 'desc';

/**
 * FilterRawEventLogsArg interface for filtering raw event logs.
 */
interface FilterRawEventLogsOptions {
    /**
     * Block range
     */
    range?: Range;
    /**
     * Pagination options
     */
    options?: PaginationOptions;
    /**
     * Event filters
     */
    criteriaSet?: EventCriteria[];
    /**
     * Sorting order
     */
    order?: EventDisplayOrder;
}

/**
 * FilterEventLogsArg interface for filtering decoded event logs.
 */
interface FilterEventLogsOptions {
    /**
     * Block range
     */
    range?: Range;
    /**
     * Pagination options
     */
    options?: PaginationOptions;
    /**
     * Event filters
     */
    criteriaSet?: FilterCriteria[];
    /**
     * Sorting order
     */
    order?: EventDisplayOrder;
}

/**
 * FilterTransferLogsArg interface for filtering transfer logs.
 */
interface FilterTransferLogsOptions {
    /**
     * Block range to query
     */
    range?: Range;
    /**
     * Pagination options
     */
    options?: PaginationOptions;
    /**
     * Criteria to filter transfers by
     */
    criteriaSet: TransferCriteria[];
    /**
     * Ordering of results
     */
    order: EventDisplayOrder;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * Event metadata for an entity.
 */
interface Metadata {
    /**
     * Block identifier associated with the entity
     */
    blockID: string;
    /**
     * Block number associated with the entity
     */
    blockNumber: number;
    /**
     * Timestamp of the block
     */
    blockTimestamp: number;
    /**
     * Transaction ID associated with the entity
     */
    txID: string;
    /**
     * Transaction origin information
     */
    txOrigin: string;
    /**
     * Index of the clause
     */
    clauseIndex: number;
}

/**
 * TransferCriteria interface for filtering transfer logs.
 */
interface TransferCriteria {
    /**
     * Transaction origin filter for transfer criteria.
     */

    txOrigin?: string;
    /**
     * Sender's address filter.
     */

    sender?: string;
    /**
     * Recipient's address filter.
     */
    recipient?: string;
}

/**
 * Event interface representing event data.
 */
interface Event {
    /**
     * The address related to the event.
     */
    address: string;

    /**
     * Event topics or categories.
     */
    topics: string[];

    /**
     * Event data.
     */
    data: string;
}

/**
 * Transfer interface representing transfer data.
 */
interface Transfer {
    /**
     * The sender's address in the transfer.
     */
    sender: string;

    /**
     * The recipient's address in the transfer.
     */
    recipient: string;

    /**
     * The amount being transferred.
     */
    amount: string;
}

/**
 * EventLogs interface, combining Event and EventMetadata.
 */
interface EventLogs extends Event {
    /**
     * Event logs with associated metadata
     */
    meta: Metadata;

    /**
     * The decoded data from the event.
     */
    decodedData?: Result[];
}

/**
 * TransferLogs interface, combining Transfer and WithMeta.
 */
interface TransferLogs extends Transfer {
    /**
     * Transfer logs with associated metadata
     */
    meta: Metadata;
}

/* --- Responses Outputs end --- */

export type {
    FilterEventLogsOptions,
    Event,
    EventLogs,
    FilterTransferLogsOptions,
    FilterRawEventLogsOptions,
    Transfer,
    TransferLogs,
    EventCriteria,
    FilterCriteria,
    Range,
    PaginationOptions,
    EventDisplayOrder
};
