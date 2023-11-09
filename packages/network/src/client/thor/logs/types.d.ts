interface Event {
    address: string;
    topics: string[];
    data: string;
}

interface Transfer {
    sender: string;
    recipient: string;
    amount: string;
}

interface Range {
    unit: 'block' | 'time';
    from: number;
    to: number;
}

interface WithMeta {
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        txID: string;
        txOrigin: string;
        clauseIndex: number;
    };
}

type Criteria<T extends 'event' | 'transfer'> = T extends 'event'
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

interface FilterEventLogsArg {
    range: Range;
    options: {
        offset: number;
        limit: number;
    };
    criteriaSet: Array<Criteria<'event'>>;
    order: 'asc' | 'desc';
}

interface FilterTransferLogsArg {
    range: Range;
    options: {
        offset: number;
        limit: number;
    };
    criteriaSet: Array<Criteria<'transfer'>>;
    order: 'asc' | 'desc';
}

interface EventLogs extends Event {
    meta: WithMeta;
}

interface TransferLogs extends Transfer {
    meta: WithMeta;
}

export type {
    FilterEventLogsArg,
    EventLogs,
    FilterTransferLogsArg,
    TransferLogs
};
