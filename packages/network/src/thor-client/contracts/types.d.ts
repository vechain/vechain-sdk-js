import {
    type TransactionBodyOptions,
    type SimulateTransactionOptions
} from '../transactions';

/* --------- Input types Start --------- */

type ContractTransactionOptions = Omit<TransactionBodyOptions, 'isDelegated'>;

/* --------- Input types End --------- */

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = SimulateTransactionOptions;

export type { ContractTransactionOptions, ContractCallOptions };
