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
 * Range interface for specifying a range of data.
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
 * Event metadata for an entity.
 */
interface EventMetadata {
    blockID: string; // Block identifier associated with the entity.
    blockNumber: number; // Block number associated with the entity.
    blockTimestamp: number; // Timestamp of the block.
    txID: string; // Transaction ID associated with the entity.
    txOrigin: string; // Transaction origin information.
    clauseIndex: number; // Index of the clause.
}

/**
 * EventCriteria interface for filtering event logs.
 */
interface EventCriteria {
    address?: string; // Address filter for event criteria.
    topic0?: string; // Event topic filter.
    topic1?: string;
    topic2?: string;
    topic3?: string;
    topic4?: string;
}

/**
 * TransferCriteria interface for filtering transfer logs.
 */
interface TransferCriteria {
    txOrigin?: string; // Transaction origin filter for transfer criteria.
    sender?: string; // Sender's address filter.
    recipient?: string; // Recipient's address filter.
}

/**
 * FilterEventLogsArg interface for filtering event logs.
 */
interface FilterEventLogsArg {
    range?: Range; // Range of data to filter.
    options?: {
        offset: number; // Offset for pagination.
        limit: number; // Limit for the number of results to return.
    };
    criteriaSet: EventCriteria[]; // Criteria set for event logs.
    order: 'asc' | 'desc'; // Order for sorting (ascending or descending).
}

/**
 * FilterTransferLogsArg interface for filtering transfer logs.
 */
interface FilterTransferLogsArg {
    range?: Range; // Range of data to filter.
    options?: {
        offset: number; // Offset for pagination.
        limit: number; // Limit for the number of results to return.
    };
    criteriaSet: TransferCriteria[]; // Criteria set for transfer logs.
    order: 'asc' | 'desc'; // Order for sorting (ascending or descending).
}

/**
 * EventLogs interface, combining Event and EventMetadata.
 */
type EventLogs = Event & EventMetadata;

/**
 * TransferLogs interface, combining Transfer and WithMeta.
 */
type TransferLogs = Transfer & EventMetadata;

export type {
    FilterEventLogsArg,
    EventLogs,
    FilterTransferLogsArg,
    TransferLogs
};
