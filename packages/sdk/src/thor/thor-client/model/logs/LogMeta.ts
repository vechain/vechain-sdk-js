import { type LogMetaResponse } from '@thor/logs/response/LogMetaResponse';
import { type Address, type Hex } from '@vcdm';

class LogMeta {
    /**
     * The block identifier in which the log was included.
     */
    readonly blockID: Hex;

    /**
     * The block number (height) of the block in which the log was included.
     */
    readonly blockNumber: number;

    /**
     * The UNIX timestamp of the block in which the log was included.
     */
    readonly blockTimestamp: number;

    /**
     * The transaction identifier, from which the log was generated.
     */
    readonly txID: Hex;

    /**
     * The account from which the transaction was sent.
     */
    readonly txOrigin: Address;

    /**
     * The index of the clause in the transaction, from which the log was generated.
     */
    readonly clauseIndex: number;

    /**
     * The index of the transaction in the block, from which the log was generated.
     */
    readonly txIndex: number | null;

    /**
     * The index of the log in the receipt's outputs.
     * This is an overall index among all clauses.
     */
    readonly logIndex: number | null;

    /**
     * Creates a new LogMeta instance from a LogMetaResponse.
     * @param logMeta - The LogMetaResponse to create the LogMeta from.
     */
    constructor(logMeta: LogMetaResponse) {
        this.blockID = logMeta.blockID;
        this.blockNumber = logMeta.blockNumber;
        this.blockTimestamp = logMeta.blockTimestamp;
        this.txID = logMeta.txID;
        this.txOrigin = logMeta.txOrigin;
        this.clauseIndex = logMeta.clauseIndex;
        this.txIndex = logMeta.txIndex ?? null;
        this.logIndex = logMeta.logIndex ?? null;
    }
}

export { LogMeta };
