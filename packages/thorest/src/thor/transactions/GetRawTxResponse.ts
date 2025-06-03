import { HexUInt, IllegalArgumentError } from '@vechain/sdk-core';
import { type GetRawTxResponseJSON, TxMeta } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/transactions/GetRawTxResponse.ts!';

/**
 * [GetRawTxResponse](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get)
 */
class GetRawTxResponse {
    /**
     * The raw RLP encoded transaction.
     *
     * Match pattern: ^0x[0-9a-f]*$
     */
    readonly raw: HexUInt;

    /**
     * Transaction metadata such as block number, block timestamp, etc.
     */
    readonly meta: TxMeta;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {GetRawTxResponseJSON} json - The JSON object containing raw transaction data and metadata.
     * @throws {IllegalArgumentError} If the input JSON cannot be parsed correctly.
     */
    constructor(json: GetRawTxResponseJSON) {
        try {
            this.raw = HexUInt.of(json.raw);
            this.meta = new TxMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetRawTxResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance into a GetRawTxResponseJSON representation.
     *
     * @return {GetRawTxResponseJSON} The JSON object representing the current instance.
     */
    toJSON(): GetRawTxResponseJSON {
        return {
            raw: this.raw.toString(),
            meta: this.meta.toJSON()
        } satisfies GetRawTxResponseJSON;
    }
}

export { GetRawTxResponse };
