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
declare function transactionBodyToTransactionRequestInput(transactionBody: TransactionBody, from: string): TransactionRequestInput;
export { transactionBodyToTransactionRequestInput };
//# sourceMappingURL=utils.d.ts.map