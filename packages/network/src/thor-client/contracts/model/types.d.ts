import type { ContractCallResult } from '../types';
import type { SendTransactionResult } from '../../transactions';

type ContractFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

type ContractFunctionRead = Record<
    string,
    ContractFunction<ContractCallResult>
>;

type ContractFunctionTransact = Record<
    string,
    ContractFunction<SendTransactionResult>
>;

export type {
    ContractFunction,
    ContractFunctionRead,
    ContractFunctionTransact
};
