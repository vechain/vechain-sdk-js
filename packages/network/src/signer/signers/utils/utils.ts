import { type TransactionBody } from '@vechain/sdk-core';
import { type TransactionRequestInput } from '../types';

/**
 * Utility method to convert a transaction body to a transaction request input
 *
 * @param transactionBody - The transaction body to convert
 * @param from - The address of the sender
 *
 * @returns The transaction request input
 * @throws Error if nonce is negative
 */
function transactionBodyToTransactionRequestInput(
    transactionBody: TransactionBody,
    from: string
): TransactionRequestInput {
    // Validate that nonce is not negative
    if (transactionBody.nonce !== undefined) {
        const nonceValue =
            typeof transactionBody.nonce === 'string'
                ? parseInt(transactionBody.nonce, 10)
                : transactionBody.nonce;

        if (nonceValue < 0) {
            throw new Error('Transaction nonce must be a positive number');
        }
    }

    return {
        from,
        chainTag: transactionBody.chainTag,
        blockRef: transactionBody.blockRef,
        expiration: transactionBody.expiration,
        clauses: transactionBody.clauses,
        gasPriceCoef: transactionBody.gasPriceCoef,
        gas: transactionBody.gas,
        dependsOn: transactionBody.dependsOn ?? undefined,
        nonce: transactionBody.nonce,
        reserved: transactionBody.reserved
    } satisfies TransactionRequestInput;
}

export { transactionBodyToTransactionRequestInput };
