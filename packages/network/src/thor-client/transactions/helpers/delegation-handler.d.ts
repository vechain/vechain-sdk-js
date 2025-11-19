import { type Transaction } from '@vechain/sdk-core';
import { type SignTransactionOptions } from '../types';
import { type HttpClient } from '../../../http';
/**
 * Provide a set of utils for the delegation type.
 * It is a mutual exclusion between gasPayerPrivateKey and gasPayerServiceUrl. (@see SignTransactionOptions)
 *
 * The aim of this handler is to:
 *   - Understand the kind of delegation and the delegation info
 *   - Provide a method to get the delegation signature
 *
 * @param gasPayer - The gasPayer options.
 */
declare const DelegationHandler: (gasPayer?: SignTransactionOptions | null) => {
    isDelegated: () => boolean;
    gasPayerOrUndefined: () => SignTransactionOptions | undefined;
    gasPayerOrNull: () => SignTransactionOptions | null;
    getDelegationSignatureUsingUrl: (tx: Transaction, originAddress: string, httpClient: HttpClient) => Promise<Uint8Array>;
};
export { DelegationHandler };
//# sourceMappingURL=delegation-handler.d.ts.map