import { type SignedTransactionRequestJSON } from '@thor/thorest/json/SignedTransactionRequestJSON';

/**
 * Represents the content of a {@link SponsoredTransactionRequest} object in JSON format.
 */
interface SponsoredTransactionRequestJSON extends SignedTransactionRequestJSON {
    gasPayer: string; // hex address
    gasPayerSignature: string; // hex signature
}

export { type SponsoredTransactionRequestJSON };
