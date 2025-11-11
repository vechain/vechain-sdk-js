import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { concatBytes } from '@noble/curves/utils.js';

/**
 * Abstract class representing a signer, capable of signing
 * transaction requests and holding address details.
 */
abstract class Signer {
    /**
     * Signs a given transaction request.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be signed.
     * @returns {TransactionRequest} The signed transaction request object.
     */
    abstract sign(
        transactionRequest: TransactionRequest
    ): TransactionRequest | Promise<TransactionRequest>;

    /**
     * Checks if the required signatures are present for the transaction type.
     *
     * @param transactionRequest - The transaction request to check
     * @returns true if all required signatures are present, false otherwise
     */
    protected static hasRequiredSignatures(
        transactionRequest: TransactionRequest
    ): boolean {
        if (transactionRequest.isIntendedToBeSponsored) {
            return (
                transactionRequest.originSignature.length > 0 &&
                transactionRequest.gasPayerSignature.length > 0
            );
        }
        return transactionRequest.originSignature.length > 0;
    }

    /**
     * Finalizes the transaction request based on its sponsorship intent and signature availability.
     *
     * - If the `transactionRequest` is intended to be sponsored and has both origin and gas payer signatures,
     *   a new `TransactionRequest` is created, combining these signatures;
     *   if only one or neither signature is present, the original `transactionRequest` is returned unmodified.
     *
     * - If the `transactionRequest` is not intended to be sponsored,
     *   if the origin signature is present, a new `TransactionRequest` is created based on the origin signature;
     *   otherwise, the original request is returned as-is.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request to be finalized, which includes
     * details of the transaction, its signatures (if available), and its sponsorship intent.
     * @return {TransactionRequest} The finalized `TransactionRequest` object, updated based on the sponsorship
     * intent and available signatures.
     *
     * @remarks Security auditable method, depends on
     * - `concatBytes` from [noble-curves](https://github.com/paulmillr/noble-curves).
     */
    protected static finalize(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        // Handle sponsored transactions
        if (transactionRequest.isIntendedToBeSponsored) {
            if (this.hasRequiredSignatures(transactionRequest)) {
                return new TransactionRequest(
                    transactionRequest,
                    transactionRequest.originSignature,
                    transactionRequest.gasPayerSignature,
                    concatBytes(
                        transactionRequest.originSignature,
                        transactionRequest.gasPayerSignature
                    )
                );
            }
            return transactionRequest;
        }
        // Handle regular transactions
        if (this.hasRequiredSignatures(transactionRequest)) {
            return new TransactionRequest(
                transactionRequest,
                transactionRequest.originSignature,
                transactionRequest.gasPayerSignature, // This is an empty array for regular transactions.
                transactionRequest.originSignature
            );
        }
        return transactionRequest;
    }
}

export { Signer };
