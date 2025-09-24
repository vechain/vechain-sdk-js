import { type TransactionRequestJSON } from '@thor/thorest/json/TransactionRequestJSON';

/**
 * Represents the content of a {@link SignedTransactionRequest} object in JSON format.
 */
interface SignedTransactionRequestJSON extends TransactionRequestJSON {
    signature: string; // hex string
}

export { type SignedTransactionRequestJSON };
