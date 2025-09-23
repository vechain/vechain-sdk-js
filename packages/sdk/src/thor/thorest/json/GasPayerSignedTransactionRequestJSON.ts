import { type TransactionRequestJSON } from '@thor/thorest/json/TransactionRequestJSON';

interface GasPayerSignedTransactionRequestJSON extends TransactionRequestJSON {
    gasPayer: string; // hex address
    gasPayerSignature: string; // hex signature
}

export { type GasPayerSignedTransactionRequestJSON };
