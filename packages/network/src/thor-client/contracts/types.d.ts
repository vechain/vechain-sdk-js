import type {
    TransactionBodyOptions,
    SimulateTransactionOptions
} from '../transactions';

import type { vechain_sdk_core_ethers } from '@vechain/sdk-core';

/* --------- Input types Start --------- */

type ContractTransactionOptions = Omit<TransactionBodyOptions, 'isDelegated'>;

/* --------- Input types End --------- */

/**
 * Defines the options for executing a contract call within a blockchain environment.
 */
type ContractCallOptions = SimulateTransactionOptions;

type ContractCallResult = vechain_sdk_core_ethers.Result;

export type {
    ContractTransactionOptions,
    ContractCallOptions,
    ContractCallResult
};
