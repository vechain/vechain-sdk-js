import { type OriginSignedTransactionRequestJSON } from '@thor/thorest/json/OriginSignedTransactionRequestJSON';

/**
 * Represents the content of a {@link SponsoredTransactionRequest} object in JSON format.
 */
interface SponsoredTransactionRequestJSON
    extends OriginSignedTransactionRequestJSON {
    gasPayer: string; // hex address
    gasPayerSignature: string; // hex signature
}

export { type SponsoredTransactionRequestJSON };
