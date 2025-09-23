import { type TransactionRequestJSON } from '@thor/thorest/json/TransactionRequestJSON';

/**
 * Represents the content of a {@link SignedTransactionRequest} object in JSON format.
 */
interface OriginSignedTransactionRequestJSON extends TransactionRequestJSON {
    originSignature: string; // hex origin signature
    signature: string; // hex signature
}

export { type OriginSignedTransactionRequestJSON };
