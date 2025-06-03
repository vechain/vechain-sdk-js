import { IllegalArgumentError } from '@vechain/sdk-core';
import { type GetTxReceiptResponseJSON, Receipt, ReceiptMeta } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/transactions/GetTxReceiptResponse.ts!';

/**
 * [GetTxReceiptResponse](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get)
 */
class GetTxReceiptResponse extends Receipt {
    /**
     *  The transaction receipt metadata such as block number, block timestamp, etc.
     */
    readonly meta: ReceiptMeta;

    /**
     * Constructs an instance of the class using the provided JSON object.
     * Parses and initializes the receipt metadata.
     *
     * @param {GetTxReceiptResponseJSON} json - The JSON object containing the transaction receipt details.
     * @throws {IllegalArgumentError} If the provided JSON object cannot be parsed or is invalid.
     */
    constructor(json: GetTxReceiptResponseJSON) {
        try {
            super(json);
            this.meta = new ReceiptMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetTxReceiptResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance into a GetTxReceiptResponseJSON representation.
     *
     * @return {GetTxReceiptResponseJSON} The JSON object representing the current instance.
     */
    toJSON(): GetTxReceiptResponseJSON {
        return {
            ...super.toJSON(),
            meta: this.meta.toJSON()
        } satisfies GetTxReceiptResponseJSON;
    }
}

export { GetTxReceiptResponse };
