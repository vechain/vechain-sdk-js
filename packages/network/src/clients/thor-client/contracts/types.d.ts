import type { TransactionSimulationResult } from '../../thorest-client';

/**
 * Represents the result of a transaction involving a smart contract, including its ID
 * and the results of individual transaction clauses.
 */
interface ContractTransactionResult {
    /**
     * The unique identifier for the transaction.
     */
    id: string;

    /**
     * An array of results for individual transaction clauses.
     */
    clausesResults: TransactionSimulationResult[];
}

export type { ContractTransactionResult };
