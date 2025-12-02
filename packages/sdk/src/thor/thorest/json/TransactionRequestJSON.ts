import { type ClauseJSON } from '@thor/thorest/json/ClauseJSON';

/**
 * Represents the content of a {@link TransactionRequest} object in JSON format.
 */
interface TransactionRequestJSON {
    blockRef: string; // hex string
    chainTag: number;
    clauses: ClauseJSON[];
    dependsOn: string | null; // hex string or null
    expiration: number;
    gas: bigint;
    gasPriceCoef?: bigint;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce: string; // hex string
    signature?: string; // hex string
}

export { type TransactionRequestJSON };
