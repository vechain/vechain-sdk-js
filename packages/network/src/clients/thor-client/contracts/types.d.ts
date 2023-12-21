import {
    type TransactionBodyOptions,
    type TransactionSimulationResult,
    type SimulateTransactionOptions
} from '../transactions';

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

/* --------- Input types Start --------- */

type ContractTransactionOptions = Omit<TransactionBodyOptions, 'isDelegated'>;

/* --------- Input types End --------- */

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = SimulateTransactionOptions;

export type {
    ContractTransactionResult,
    ContractTransactionOptions,
    ContractCallOptions
};
