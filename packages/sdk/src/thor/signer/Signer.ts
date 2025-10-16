import { type TransactionRequest } from '@thor/thor-client/model/transactions';
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
     * Signs a given transaction request.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @returns {TransactionRequest} The signed transaction request object.
     */
    sign: (transactionRequest: TransactionRequest) => TransactionRequest;
}

export { type Signer };
