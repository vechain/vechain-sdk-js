import { type TransactionRequestJSON } from '@thor/json/TransactionRequestJSON';

interface SignedTransactionRequestJSON extends TransactionRequestJSON {
    origin: string;
    senderSignature: Uint8Array;
    signature: Uint8Array;
}

export { type SignedTransactionRequestJSON };
