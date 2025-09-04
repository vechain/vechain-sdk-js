import { HexUInt } from '@common/vcdm';
import { type RawTxJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/transactions/model/RawTx.ts!';

/**
 * [RawTx](http://localhost:8669/doc/stoplight-ui/#/schemas/RawTx)
 */
class RawTx {
    /**
     * The raw RLP encoded transaction.
     */
    raw: HexUInt;

    /**
     * Constructs an instance of the class by parsing the provided raw transaction JSON.
     *
     * @param {RawTxJSON} json - The raw transaction JSON object containing the transaction data to be parsed and validated.
     * @throws {IllegalArgumentError} If the provided JSON object cannot be parsed or is invalid.
     */
    constructor(json: RawTxJSON) {
        try {
            this.raw = HexUInt.of(json.raw);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: BlockJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current transaction instance into a JSON representation.
     *
     * @return {RawTxJSON} A JSON object containing the raw transaction data.
     */
    toJSON(): RawTxJSON {
        return {
            raw: this.raw.toString()
        } satisfies RawTxJSON;
    }
}

export { RawTx };
