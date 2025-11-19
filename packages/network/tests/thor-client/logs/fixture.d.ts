import { type FilterRawEventLogsOptions, type FilterTransferLogsOptions } from '../../../src';
declare const argFilterEventLogs: FilterRawEventLogsOptions;
declare const argFilterTransferLogs: FilterTransferLogsOptions;
declare const expectedFilterEventLogs: {
    address: string;
    topics: string[];
    data: string;
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        txID: string;
        txOrigin: string;
        clauseIndex: number;
    };
}[];
declare const expectedFilterTransferLogs: {
    amount: string;
    meta: {
        blockID: string;
        blockNumber: number;
        blockTimestamp: number;
        clauseIndex: number;
        txID: string;
        txOrigin: string;
    };
    recipient: string;
    sender: string;
}[];
export { argFilterEventLogs, argFilterTransferLogs, expectedFilterEventLogs, expectedFilterTransferLogs };
//# sourceMappingURL=fixture.d.ts.map