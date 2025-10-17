import { type ClauseJSON } from '@thor/thorest/json/ClauseJSON';

/**
 * Represents the content of a {@link TransactionRequest} object in JSON format.
 */
interface TransactionRequestJSON {
    blockRef: string;
    chainTag: number;
    clauses: ClauseJSON[];
    dependsOn: string | null;
    expiration: number;
    gas: bigint;
    gasPriceCoef?: bigint;
    nonce: number;
    isIntendedToBeSponsored: boolean;
    maxFeePerGas?: bigint;
    maxPriorityFeePerGas?: bigint;
}

export { type TransactionRequestJSON };
