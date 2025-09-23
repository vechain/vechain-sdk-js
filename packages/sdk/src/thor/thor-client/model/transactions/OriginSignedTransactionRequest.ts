import {
    TransactionRequest,
    type TransactionRequestParam
} from './TransactionRequest';
import type { Address } from '@common';
import { HexUInt } from '@common';
import { type OriginSignedTransactionRequestJSON } from '@thor/thorest/json';
/**
 * Represents the parameters required for a signed transaction request.
 * Extends the base `TransactionRequestParam` interface to include fields specific to signed transactions.
 */
interface OriginSignedTransactionRequestParam extends TransactionRequestParam {
    /**
     * The address of the origin account sending and signing the transaction.
     */
    origin: Address;

    /**
     * The digital signature of the origin.
     */
    originSignature: Uint8Array;

    /**
     * The digital signature of the transaction.
     */
    signature: Uint8Array;
}

/**
 * Represents a signed transaction request extending {@link TransactionRequest}
 * with the additional properties required to represent a signed transaction request.
 *
 * The SignedTransactionRequest is immutable and guarantees defensive copying
 * of input data for its cryptographic signatures.
 */
class OriginSignedTransactionRequest
    extends TransactionRequest
    implements OriginSignedTransactionRequestParam
{
    /**
     * The address of the origin account sending and signing the transaction.
     */
    public readonly origin: Address;

    /**
     * The digital signature of the origin.
     */
    public readonly originSignature: Uint8Array;

    /**
     * The digital signature of the transaction.
     */
    public readonly signature: Uint8Array;

    /**
     * Constructor for initializing a new instance of the class with the given parameters.
     *
     * @param {OriginSignedTransactionRequestParam} params - An object containing the parameters required to initialize the class.
     * @param {string} params.origin - The origin information for the signed transaction.
     * @param {Uint8Array} params.originSignature - The signature of the origin, provided as an array of unsigned integers.
     * @param {Uint8Array} params.signature - The signed transaction, provided as an array of unsigned integers.
     * @return {void}
     */
    public constructor(params: OriginSignedTransactionRequestParam) {
        super(params);
        this.origin = params.origin;
        // Defensive copies to avoid external mutation.
        this.originSignature = new Uint8Array(params.originSignature);
        this.signature = new Uint8Array(params.signature);
    }

    /**
     * Checks if the transaction request is signed.
     *
     * @return {boolean} `true`, because a `SignedTransactionRequest` instance has a signature.
     */
    public isSigned(): boolean {
        return true;
    }

    /**
     * Converts the SignedTransactionRequest object into its JSON representation.
     *
     * @return {OriginSignedTransactionRequestJSON} The JSON representation of the SignedTransactionRequest object.
     */
    public toJSON(): OriginSignedTransactionRequestJSON {
        return {
            ...super.toJSON(),
            origin: this.origin.toString(),
            originSignature: HexUInt.of(this.originSignature).toString(),
            signature: HexUInt.of(this.signature).toString()
        } satisfies OriginSignedTransactionRequestJSON;
    }
}

export {
    type OriginSignedTransactionRequestParam,
    OriginSignedTransactionRequest
};
