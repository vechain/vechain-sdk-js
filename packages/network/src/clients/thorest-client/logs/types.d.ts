/* --- Input options start --- */

/**
 * Range interface for specifying a range of data.
 *
 * @private
 */
interface Range {
    /**
     * The unit for specifying the range (block or time).
     */
    unit: 'block' | 'time'; // The unit for specifying the range (block or time).

    /**
     * The starting point of the range.
     */
    from: number;

    /**
     * The ending point of the range.
     */
    to: number;
}

/**
 * Options interface for specifying Pagination Options (offset and limits).
 *
 * @private
 */
interface PaginationOptions {
    /**
     * Offset for pagination.
     */
    offset: number;

    /**
     * Limit for the number of results to return.
     */
    limit: number;
}

/**
 * EventCriteria interface for filtering event logs.
 *
 * @private
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
 *
 * @private
 */
type EventDisplayOrder = 'asc' | 'desc';

/**
 * FilterEventLogsArg interface for filtering event logs.
 *
 * @public
 */
interface FilterEventLogsOptions {
    range?: Range;
    options?: PaginationOptions;
    criteriaSet: EventCriteria[];
    order: EventDisplayOrder;
}

/**
 * FilterTransferLogsArg interface for filtering transfer logs.
 *
 * @public
 */
interface FilterTransferLogsOptions {
    range?: Range;
    options?: PaginationOptions;
    criteriaSet: TransferCriteria[];
    order: EventDisplayOrder;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * Event metadata for an entity.
 *
 * @private
 */
interface Metadata {
    blockID: string; // Block identifier associated with the entity.
    blockNumber: number; // Block number associated with the entity.
    blockTimestamp: number; // Timestamp of the block.
    txID: string; // Transaction ID associated with the entity.
    txOrigin: string; // Transaction origin information.
    clauseIndex: number; // Index of the clause.
}

/**
 * TransferCriteria interface for filtering transfer logs.
 *
 * @private
 */
interface TransferCriteria {
    txOrigin?: string; // Transaction origin filter for transfer criteria.
    sender?: string; // Sender's address filter.
    recipient?: string; // Recipient's address filter.
}

/**
 * Event interface representing event data.
 *
 * @public
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
 *
 * @public
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
 *
 * @public
 */
interface EventLogs extends Event {
    meta: Metadata; // Event logs with associated metadata.
}

/**
 * TransferLogs interface, combining Transfer and WithMeta.
 *
 * @public
 */
interface TransferLogs extends Transfer {
    meta: Metadata; // Transfer logs with associated metadata.
}

/* --- Responses Outputs end --- */

export type {
    FilterEventLogsOptions,
    Event,
    EventLogs,
    FilterTransferLogsOptions,
    Transfer,
    TransferLogs
};
