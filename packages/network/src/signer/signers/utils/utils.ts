import { type TransactionBody } from '@vechain/sdk-core';
import { type TransactionRequestInput } from '../types';

/**
 * Utility method to convert a transaction body to a transaction request input
 *
 * @param transactionBody - The transaction body to convert
 * @param from - The address of the sender
 *
 * @returns The transaction request input
 */
function transactionBodyToTransactionRequestInput(
    transactionBody: TransactionBody,
    from: string
): TransactionRequestInput {
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
