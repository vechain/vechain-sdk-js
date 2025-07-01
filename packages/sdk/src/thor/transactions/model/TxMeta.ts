import {
    type Hex,
    HexUInt32,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { type TxMetaJSON } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/model/TxMeta.ts!';

/**
 * [TxMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/TxMeta)
 */
class TxMeta {
    /**
     * The block identifier in which the transaction was included.
     *
     * Match pattern: ^0x[0-9a-f]{64}$
     */
    readonly blockID: Hex;

    /**
     * The block number (height) of the block in which the transaction was included.
     */
    readonly blockNumber: UInt;

    /**
     * The UNIX timestamp of the block in which the transaction was included.
     */
    readonly blockTimestamp: UInt;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {TxMetaJSON} json - The JSON object containing the transaction metadata.
     * @throws {IllegalArgumentError} If the provided JSON object cannot be parsed or is invalid.
     */
    constructor(json: TxMetaJSON) {
        try {
            this.blockID = HexUInt32.of(json.blockID);
            this.blockNumber = UInt.of(json.blockNumber);
            this.blockTimestamp = UInt.of(json.blockTimestamp);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ClauseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a TxMetaJSON representation.
     *
     * @return {TxMetaJSON} The JSON object representing the current instance.
     */
    toJSON(): TxMetaJSON {
        return {
            blockID: this.blockID.toString(),
            blockNumber: this.blockNumber.valueOf(),
            blockTimestamp: this.blockTimestamp.valueOf()
        } satisfies TxMetaJSON;
    }
}

export { TxMeta };
