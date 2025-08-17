import { type SignedTransactionRequestJSON } from '@thor/json/SignedTransactionRequestJSON';

interface DelegatedSignedTransactionRequestJSON extends SignedTransactionRequestJSON {
    gasPayer: string;
    gasPayerSignature: Uint8Array;
}

export { type DelegatedSignedTransactionRequestJSON };
