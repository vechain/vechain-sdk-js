import type { ContractCallResult } from '../types';
import type { SendTransactionResult } from '../../transactions';

/**
 * Represents a generic contract function type that accepts an arbitrary number of arguments
 * and returns a promise that resolves to a generic type `T`. This type is typically used to
 * model the behavior of smart contract functions in a blockchain context.
 *
 * @typeParam T - The expected return type of the promise. Defaults to `unknown` if not specified.
 * @param args - An array of arguments that the contract function accepts. The types of these arguments
 *               are not specified, allowing for flexibility in function signatures.
 * @returns A promise that resolves to the type `T`, representing the result of the contract function execution.
 */
type ContractFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

/**
 * Defines a mapping of contract function names to their corresponding read-only contract functions.
 * Each function in this record is expected to return a `Promise` that resolves to `ContractCallResult`,
 * which should encapsulate the result of a read-only contract call.
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunction` type with `ContractCallResult` as the return type.
 */
type ContractFunctionRead = Record<
    string,
    ContractFunction<ContractCallResult>
>;

/**
 * Defines a mapping of contract function names to their corresponding transactional contract functions.
 * Each function in this record is expected to return a `Promise` that resolves to `SendTransactionResult`,
 * which should encapsulate the result of a transactional contract call (e.g., modifying state on the blockchain).
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunction` type with `SendTransactionResult` as the return type.
 */
type ContractFunctionTransact = Record<
    string,
    ContractFunction<SendTransactionResult>
>;

export type {
    ContractFunction,
    ContractFunctionRead,
    ContractFunctionTransact
};
