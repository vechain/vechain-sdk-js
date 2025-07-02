import { Address, Hex, HexUInt32 } from '@vcdm';

import { IllegalArgumentError } from '@errors';
import { TxMeta } from '../transactions/model/TxMeta';
import { type ReceiptMetaJSON } from '@thor/json/ReceiptMetaJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/transactions/ReceiptMeta.ts!';

/**
 * [ReceiptMeta](http://localhost:8669/doc/stoplight-ui/#/schemas/ReceiptMeta)
 */
class ReceiptMeta extends TxMeta {
    /**
     * The transaction identifier.
     *
     * Match pattern: ^0x[0-9a-f]{64}$
     */
    readonly txID: Hex;

    /**
     * The account from which the transaction was sent.
     *
     * Match pattern: ^0x[0-9a-f]{40}$
     */
    readonly txOrigin: Address;

    /**
     * Constructs a new instance of the class using data from a given JSON object.
     *
     * @param {ReceiptMetaJSON} json - The ReceiptMetaJSON object containing data for the instance.
     * @throws {IllegalArgumentError} If the provided JSON object cannot be parsed or is invalid.
     */
    constructor(json: ReceiptMetaJSON) {
        try {
            super(json);
            this.txID = HexUInt32.of(json.txID);
            this.txOrigin = Address.of(json.txOrigin);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ReceiptMetaJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance into a ReceiptMetaJSON representation.
     *
     * @return {ReceiptMetaJSON} The JSON object representing the current instance.
     */
    toJSON(): ReceiptMetaJSON {
        return {
            ...super.toJSON(),
            txID: this.txID.toString(),
            txOrigin: this.txOrigin.toString()
        } satisfies ReceiptMetaJSON;
    }
}

export { ReceiptMeta };
