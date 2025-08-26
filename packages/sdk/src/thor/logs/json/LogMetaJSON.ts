/**
 * [LogMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/LogMeta)
 */
interface LogMetaJSON {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
    txID: string;
    txOrigin: string;
    clauseIndex: number;
    txIndex: number | undefined;
    logIndex: number | undefined;
}

export { type LogMetaJSON };
