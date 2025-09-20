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
    gasPriceCoef: bigint;
    isIntendedToBeSponsored: boolean;
    maxFeePerGasCoef?: bigint;
    maxPriorityFeePerGasCoef?: bigint;
    nonce: number;
    origin?: string;
}

export { type TransactionRequestJSON };
