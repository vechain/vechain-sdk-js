/**
 * [LogMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/LogMeta)
 */
interface LogMetaJSON {
    blockID: string;
    blockNumber: number | null;
    blockTimestamp: number | null;
    txID: string;
    txOrigin: string;
    clauseIndex: number | null;
    txIndex: number | null;
    logIndex: number | null;
}

export { type LogMetaJSON };
