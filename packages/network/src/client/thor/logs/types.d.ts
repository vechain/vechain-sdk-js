// Definition of the Event interface representing event data.
interface Event {
    address: string; // The address related to the event.
    topics: string[]; // Event topics or categories.
    data: string; // Event data.
}

// Definition of the Transfer interface representing transfer data.
interface Transfer {
    sender: string; // The sender's address in the transfer.
    recipient: string; // The recipient's address in the transfer.
    amount: string; // The amount being transferred.
}

// Definition of the Range interface for specifying a range of data.
interface Range {
    unit: 'block' | 'time'; // The unit for specifying the range (block or time).
    from: number; // The starting point of the range.
    to: number; // The ending point of the range.
}

// Definition of the WithMeta interface containing metadata for an entity.
interface WithMeta {
    meta: {
        blockID: string; // Block identifier associated with the entity.
        blockNumber: number; // Block number associated with the entity.
        blockTimestamp: number; // Timestamp of the block.
        txID: string; // Transaction ID associated with the entity.
        txOrigin: string; // Transaction origin information.
        clauseIndex: number; // Index of the clause.
    };
}

// Definition of the Criteria interface for filtering logs.
interface EventCriteria {
    address?: string; // Address filter for event criteria.
    topic0?: string; // Event topic filter.
    topic1?: string;
    topic2?: string;
    topic3?: string;
    topic4?: string;
}

// Definition of the Criteria interface for filtering logs.
interface TransferCriteria {
    txOrigin?: string; // Transaction origin filter for transfer criteria.
    sender?: string; // Sender's address filter.
    recipient?: string; // Recipient's address filter.
}

// Definition of the FilterEventLogsArg interface for filtering event logs.
interface FilterEventLogsArg {
    range: Range; // Range of data to filter.
    options: {
        offset: number; // Offset for pagination.
        limit: number; // Limit for the number of results to return.
    };
    criteriaSet: EventCriteria[]; // Criteria set for event logs.
    order: 'asc' | 'desc'; // Order for sorting (ascending or descending).
}

// Definition of the FilterTransferLogsArg interface for filtering transfer logs.
interface FilterTransferLogsArg {
    range: Range; // Range of data to filter.
    options: {
        offset: number; // Offset for pagination.
        limit: number; // Limit for the number of results to return.
    };
    criteriaSet: TransferCriteria[]; // Criteria set for transfer logs.
    order: 'asc' | 'desc'; // Order for sorting (ascending or descending).
}

// Definition of the EventLogs interface, combining Event and WithMeta.
interface EventLogs extends Event {
    meta: WithMeta; // Event logs with associated metadata.
}

// Definition of the TransferLogs interface, combining Transfer and WithMeta.
interface TransferLogs extends Transfer {
    meta: WithMeta; // Transfer logs with associated metadata.
}

export type {
    FilterEventLogsArg,
    EventLogs,
    FilterTransferLogsArg,
    TransferLogs
};
