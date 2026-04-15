import { Tx, TxMetaResponse } from '@thor/thorest/transactions/model';
import { type GetTxResponseJSON } from '@thor/thorest/json';
import { InvalidThorestResponseError } from '@common/errors';

class GetTxResponse extends Tx {
    /**
     * Transaction metadata such as block number, block timestamp, etc.
     */
    meta: TxMetaResponse | null;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {GetTxResponseJSON} json - The JSON object containing raw transaction data and metadata.
     * @throws {InvalidThorestResponseError} If the input JSON cannot be parsed correctly.
     */
    constructor(json: GetTxResponseJSON) {
        try {
            super(json);
            this.meta =
                json.meta !== null ? new TxMetaResponse(json.meta) : null;
        } catch (error) {
            throw new InvalidThorestResponseError(
                `GetTxResponse.constructor`,
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
            meta: this.meta?.toJSON() ?? null
        } satisfies GetTxResponseJSON;
    }
}

export { GetTxResponse };
