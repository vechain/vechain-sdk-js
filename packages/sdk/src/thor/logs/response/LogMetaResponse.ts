import { Address, HexUInt32, UInt, type Hex } from '@vcdm';
import { type LogMetaJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/LogMeta.ts!';

/**
 * [LogMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/LogMeta)
 */
class LogMetaResponse {
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
    readonly txIndex: number | undefined;

    /**
     * The index of the log in the receipt's outputs.
     * This is an overall index among all clauses.
     */
    readonly logIndex: number | undefined;

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
            this.blockNumber = UInt.of(json.blockNumber).valueOf();
            this.blockTimestamp = UInt.of(json.blockTimestamp).valueOf();
            this.txID = HexUInt32.of(json.txID);
            this.txOrigin = Address.of(json.txOrigin);
            this.clauseIndex = UInt.of(json.clauseIndex).valueOf();
            this.txIndex =
                json.txIndex != null
                    ? UInt.of(json.txIndex).valueOf()
                    : undefined;
            this.logIndex =
                json.logIndex != null
                    ? UInt.of(json.logIndex).valueOf()
                    : undefined;
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
            txIndex: this.txIndex?.valueOf() ?? undefined,
            logIndex: this.logIndex?.valueOf() ?? undefined
        } satisfies LogMetaJSON;
    }
}

export { LogMetaResponse };
