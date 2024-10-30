import type {
    SignTransactionOptions,
    SimulateTransactionOptions,
    TransactionBodyOptions
} from '../transactions/types';

import type {
    ABIFunction,
    ClauseOptions,
    TransactionClause
} from '@vechain/sdk-core';

declare module 'abitype' {
    export interface Register {
        AddressType: string;
    }
}

declare module 'viem/node_modules/abitype' {
    export interface Register {
        AddressType: string;
    }
}

/* --------- Input types Start --------- */

/**
 * Defines the options for executing a contract transaction.
 */
type ContractTransactionOptions = {
    value?: number;
    signTransactionOptions?: SignTransactionOptions;
} & TransactionBodyOptions &
    ClauseOptions;

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = SimulateTransactionOptions & ClauseOptions;

/* --------- Input types End --------- */

/**
 * Represents the result of a contract call operation, encapsulating the output of the call.
 */
interface ContractCallResult {
    success: boolean;
    result: {
        plain?: unknown; // Success result as a plain value (might be literal or object).
        array?: unknown[]; // Success result as an array (values are the same as in plain).
        errorMessage?: string;
    };
}

/**
 * Represents a contract clause, which includes the clause and the corresponding function ABI.
 */
interface ContractClause {
    clause: TransactionClause;
    functionAbi: ABIFunction;
}

export type {
    ContractCallOptions,
    ContractCallResult,
    ContractClause,
    ContractTransactionOptions
};
