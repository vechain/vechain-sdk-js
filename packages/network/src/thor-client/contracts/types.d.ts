import type {
    TransactionBodyOptions,
    SimulateTransactionOptions,
    SignTransactionOptions
} from '../transactions';

import type {
    ClauseOptions,
    ExtendedTransactionClause,
    vechain_sdk_core_ethers
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
type ContractCallResult = vechain_sdk_core_ethers.Result;

/**
 * Represents a contract clause, which includes the clause and the corresponding function fragment.
 */
interface ContractClause {
    clause: ExtendedTransactionClause;
    functionFragment: vechain_sdk_core_ethers.FunctionFragment;
}

export type {
    ContractTransactionOptions,
    ContractCallOptions,
    ContractCallResult,
    ContractClause
};
