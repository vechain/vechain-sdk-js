import type {
    TransactionBodyOptions,
    SimulateTransactionOptions,
    SignTransactionOptions
} from '../transactions';

import type {
    TransactionClause,
    vechain_sdk_core_ethers
} from '@vechain/sdk-core';

/* --------- Input types Start --------- */

/**
 * Defines the options for executing a contract transaction.
 */
type ContractTransactionOptions = {
    value?: number;
    signTransactionOptions?: SignTransactionOptions;
} & TransactionBodyOptions;

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = SimulateTransactionOptions;

/* --------- Input types End --------- */

/**
 * Represents the result of a contract call operation, encapsulating the output of the call.
 */
type ContractCallResult = vechain_sdk_core_ethers.Result;

/**
 * Represents a contract clause, which includes the clause and the corresponding function fragment.
 */
interface ContractClause {
    clause: TransactionClause;
    functionFragment: vechain_sdk_core_ethers.FunctionFragment;
}

export type {
    ContractTransactionOptions,
    ContractCallOptions,
    ContractCallResult,
    ContractClause
};
