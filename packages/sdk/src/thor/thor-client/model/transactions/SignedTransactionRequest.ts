import { TransactionRequest } from '@thor/thor-client/model/transactions/TransactionRequest';
import { type SignedTransactionRequestJSON } from '@thor/thorest/json';

/**
 * Represents a signed transaction request, extending the base `TransactionRequest` class.
 * This class includes the transaction details alongside a cryptographic signature.
 */
class SignedTransactionRequest extends TransactionRequest {
    /**
     * The transaction request signature is
     * - the `originSignature` if the `beggar` property is not set hence transaction request is not intended to be sponsored;
     * - the `originSignature` concatenated with the `gasPayerSignature` if the `beggar` property is set, hence the transaction is intended to be sponored.
     */
    public readonly signature: Uint8Array;

    /**
     * Constructor for creating an instance of the class with a transaction request and a signature.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request associated with the instance.
     * @param {Uint8Array} signature - The digital signature associated with the transaction request.
     */
    constructor(transactionRequest: TransactionRequest, signature: Uint8Array) {
        super(transactionRequest);
        // Defensive copy of the signatures to prevent accidental mutation.
        this.signature = new Uint8Array(signature);
    }

    /**
     * Converts the SignedTransactionRequest instance into its JSON representation.
     *
     * @return {SignedTransactionRequestJSON} The JSON representation of the SignedTransactionRequest object.
     */
    public toJSON(): SignedTransactionRequestJSON {
        return {
            ...super.toJSON(),
            signature: this.signature.toString()
        } satisfies SignedTransactionRequestJSON;
    }
}

export { SignedTransactionRequest };
