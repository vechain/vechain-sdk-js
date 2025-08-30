import { type Address } from '@common';
import {
    SignedTransactionRequest,
    type SignedTransactionRequestParam
} from './SignedTransactionRequest';

/**
 * Represents the parameters required for a sponsored transaction request.
 * Extends the base `SignedTransactionRequest` class with additional properties specific to sponsored transactions.
 */
interface SponsoredTransactionRequestParams
    extends SignedTransactionRequestParam {
    /**
     * The address of the sponsor delegated to pay the gas to execute the transaction request.
     */
    gasPayer: Address;

    /**
     * The signature of the sponsor delegated to pay the gas to execute the transaction request.
     */
    gasPayerSignature: Uint8Array;
}

/**
 * Represents a sponsored transaction request extending {@link SignedTransactionRequest}
 * with the additional properties required to represent a sponsored transaction request.
 */
class SponsoredTransactionRequest
    extends SignedTransactionRequest
    implements SponsoredTransactionRequestParams
{
    /**
     * The address of the sponsor delegated to pay the gas to execute the transaction request.
     */
    public readonly gasPayer: Address;

    /**
     * The signature of the sponsor delegated to pay the gas to execute the transaction request.
     */
    public readonly gasPayerSignature: Uint8Array;

    /**
     * Constructs a new instance of the class with the provided parameters.
     *
     * @param {SponsoredTransactionRequestParams} params - An object containing the parameters for the transaction.
     * @param {string} params.gasPayer - The identifier of the entity responsible for paying the gas fees.
     * @param {string} params.gasPayerSignature - The signature of the gas payer, verifying their authorization.
     * @return {void} Does not return a value.
     */
    public constructor(params: SponsoredTransactionRequestParams) {
        super(params);
        this.gasPayer = params.gasPayer;
        this.gasPayerSignature = new Uint8Array(params.gasPayerSignature);
    }
}

export { SponsoredTransactionRequest, type SponsoredTransactionRequestParams };
