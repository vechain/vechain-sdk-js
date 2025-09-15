import {
    type SignedTransactionRequest,
    type SponsoredTransactionRequest,
    type TransactionRequest
} from '@thor/thor-client/model/transactions';
import { type Address } from '@common';

/**
 * Interface representing a signer, capable of signing
 * transaction requests and holding address details.
 */
interface Signer {
    /**
     * Represents the address of the signer.
     */
    address: Address;

    /**
     * Signs a transaction request and produces a signed transaction request or a sponsored transaction request.
     *
     * @param {TransactionRequest | SignedTransactionRequest} transactionRequest - The transaction request to be signed.
     * This can either be an unsigned transaction request returning a signed transaction request,
     * or an already signed transaction request returning a sponsored transaction request.
     * @returns {SignedTransactionRequest | SponsoredTransactionRequest} The signed transaction request for an unsigned transaction request,
     * or the sponsored transaction request for a signed transaction request.
     */
    sign: (
        transactionRequest: TransactionRequest | SignedTransactionRequest
    ) => SignedTransactionRequest | SponsoredTransactionRequest;
}

export { type Signer };
