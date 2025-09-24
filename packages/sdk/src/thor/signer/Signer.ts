import {
    type SignedTransactionRequest,
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

    sign: (
        transactionRequest: TransactionRequest
    ) => TransactionRequest | SignedTransactionRequest;
}

export { type Signer };
