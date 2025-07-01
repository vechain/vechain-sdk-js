import { IllegalArgumentError } from '@vechain/sdk-core';
import { type GetTxResponseJSON, TxMeta } from '@thor';
import { Tx } from '@thor/model/Tx';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/transactions/GetTxResponse.ts!';

class GetTxResponse extends Tx {
    /**
     * Transaction metadata such as block number, block timestamp, etc.
     */
    meta: TxMeta;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {GetTxResponseJSON} json - The JSON object containing raw transaction data and metadata.
     * @throws {IllegalArgumentError} If the input JSON cannot be parsed correctly.
     */
    constructor(json: GetTxResponseJSON) {
        try {
            super(json);
            this.meta = new TxMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetTxResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current transaction object to its JSON representation.
     *
     * @return {GetTxResponseJSON} The JSON representation of the transaction object.
     */
    toJSON(): GetTxResponseJSON {
        return {
            ...super.toJSON(),
            meta: this.meta.toJSON()
        } satisfies GetTxResponseJSON;
    }
}

export { GetTxResponse };
