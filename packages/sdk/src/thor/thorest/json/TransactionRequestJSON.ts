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
    gasPriceCoef: bigint;
    isIntendedToBeSponsored: boolean;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
    nonce: number;
    origin?: string; // hex string or null
}

export { type TransactionRequestJSON };
