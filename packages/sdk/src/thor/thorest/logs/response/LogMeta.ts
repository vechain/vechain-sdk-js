import { Address, HexUInt32, UInt, type Hex } from '@common/vcdm';
import { type LogMetaJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/LogMeta.ts!';

/**
 * [LogMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/LogMeta)
 */
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
    readonly txIndex: number;

    /**
     * The index of the log in the receipt's outputs.
     * This is an overall index among all clauses.
     */
    readonly logIndex: number;

    /**
     * Constructs an instance of the log meta-data represented as a JSON object.
     *
     * @param {FilterOptionsJSON} json - The JSON object containing filter options.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} If the provided JSON object contains invalid or unparsable data.
     */
    constructor(json: LogMetaJSON) {
        try {
            this.blockID = HexUInt32.of(json.blockID);
            this.blockNumber =
                json.blockNumber != null
                    ? UInt.of(json.blockNumber).valueOf()
                    : 0;
            this.blockTimestamp =
                json.blockTimestamp != null
                    ? UInt.of(json.blockTimestamp).valueOf()
                    : 0;
            this.txID = HexUInt32.of(json.txID);
            this.txOrigin = Address.of(json.txOrigin);
            this.clauseIndex =
                json.clauseIndex != null
                    ? UInt.of(json.clauseIndex).valueOf()
                    : 0;
            this.txIndex =
                json.txIndex != null ? UInt.of(json.txIndex).valueOf() : 0;
            this.logIndex =
                json.logIndex != null ? UInt.of(json.logIndex).valueOf() : 0;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: LogMetaJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current LogMeta instance into a JSON representation.
     *
     * @return {LogMetaJSON} The JSON object representing the current LogMeta instance.
     */
    toJSON(): LogMetaJSON {
        return {
            blockID: this.blockID.toString(),
            blockNumber: this.blockNumber.valueOf(),
            blockTimestamp: this.blockTimestamp.valueOf(),
            txID: this.txID.toString(),
            txOrigin: this.txOrigin.toString(),
            clauseIndex: this.clauseIndex.valueOf(),
            txIndex: this.txIndex.valueOf(),
            logIndex: this.logIndex.valueOf()
        } satisfies LogMetaJSON;
    }
}

export { LogMeta };
