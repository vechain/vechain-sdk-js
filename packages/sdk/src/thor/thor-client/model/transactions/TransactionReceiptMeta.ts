import { type Address, type Hex } from '@common/vcdm';
import { TransactionMeta } from './TransactionMeta';
import { type ReceiptMetaResponse } from '@thor/thorest/common';
import { type TxMetaResponse } from '@thor/thorest/transactions';

class TransactionReceiptMeta extends TransactionMeta {
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
     * Creates a new instance of the class using the provided parameters.
     *
     * @param {TxMetaResponse} txMeta - The transaction metadata response.
     * @param {Hex} txID - The transaction identifier.
     * @param {Address} txOrigin - The account from which the transaction was sent.
     */
    constructor(txMeta: TxMetaResponse, txID: Hex, txOrigin: Address) {
        super(txMeta);
        this.txID = txID;
        this.txOrigin = txOrigin;
    }

    /**
     * Creates a new instance of the class using the provided receipt meta response.
     *
     * @param {ReceiptMetaResponse} response - The receipt meta response.
     * @returns {TransactionReceiptMeta} A new instance of the class.
     */
    static of(response: ReceiptMetaResponse): TransactionReceiptMeta {
        return new TransactionReceiptMeta(
            response,
            response.txID,
            response.txOrigin
        );
    }
}

export { TransactionReceiptMeta };
