import { type Hex, HexUInt32, UInt } from '@common/vcdm';
import { type TxMetaJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/transactions/model/TxMeta.ts!';

/**
 * [TxMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/TxMeta)
 */
class TxMetaResponse {
    /**
     * The block identifier in which the transaction was included.
     *
     * Match pattern: ^0x[0-9a-f]{64}$
     */
    readonly blockID: Hex;

    /**
     * The block number (height) of the block in which the transaction was included.
     */
    readonly blockNumber: number;

    /**
     * The UNIX timestamp of the block in which the transaction was included.
     */
    readonly blockTimestamp: number;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {TxMetaJSON} json - The JSON object containing the transaction metadata.
     * @throws {IllegalArgumentError} If the provided JSON object cannot be parsed or is invalid.
     */
    constructor(json: TxMetaJSON) {
        try {
            this.blockID = HexUInt32.of(json.blockID);
            this.blockNumber = UInt.of(json.blockNumber).valueOf();
            this.blockTimestamp = UInt.of(json.blockTimestamp).valueOf();
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
            blockNumber: this.blockNumber,
            blockTimestamp: this.blockTimestamp
        } satisfies TxMetaJSON;
    }
}

export { TxMetaResponse };
