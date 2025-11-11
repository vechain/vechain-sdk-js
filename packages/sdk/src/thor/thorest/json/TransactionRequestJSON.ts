import { type ClauseJSON } from '@thor/thorest/json/ClauseJSON';

/**
 * Represents the content of a {@link TransactionRequest} object in JSON format.
 */
interface TransactionRequestJSON {
    gasSponsorshipRequester?: string; // hex string
    gasPayerServiceUrl?: string; // url string
    blockRef: string; // hex string
    chainTag: number;
    clauses: ClauseJSON[];
    dependsOn: string | null; // hex string or null
    expiration: number;
    gas: bigint;
    gasPayerSignature?: string; // hex string
    gasPriceCoef?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce: number;
    originSignature?: string; // hex string
    signature?: string; // hex string
}

export { type TransactionRequestJSON };
