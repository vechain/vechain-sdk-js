import type { ContractClause } from '../types';
import type { SendTransactionResult } from '../../transactions';
import { type ContractFilter } from './contract-filter';
import { type FilterCriteria } from '../../logs';
import {
    type Abi,
    type ExtractAbiFunctionNames,
    type ExtractAbiFunction,
    type AbiParametersToPrimitiveTypes,
    type ExtractAbiEventNames,
    type AbiFunction
} from 'abitype';

/**
 * Represents a generic contract function type that accepts an arbitrary number of arguments
 * and returns a value of generic type `T`. This type is typically used to model the behavior of
 * smart contract functions in a blockchain context.
 *
 * @typeParam T - The expected return type of the function. Defaults to `unknown` if not specified.
 * @param args - An array of arguments that the contract function accepts. The types of these arguments
 *               are not specified, allowing for flexibility in function signatures.
 * @returns A value of type `T`, representing the result of the contract function execution.
 */
type ContractFunctionSync<T = unknown> = (...args: unknown[]) => T;

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
type ContractFunctionAsync<T = unknown, TAbiFunction> = (
    ...args: [
        ...Partial<{ value: number }>,
        ...AbiParametersToPrimitiveTypes<TAbiFunction['inputs'], 'inputs'>
    ]
) => Promise<T>;

/**
 * Defines a mapping of contract function names to their corresponding read-only contract functions.
 * Each function in this record is expected to return a `Promise` that resolves to `ContractCallResult`,
 * which should encapsulate the result of a read-only contract call.
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunctionAsync` type with `ContractCallResult` as the return type.
 *
 * @template TAbi - The ABI of the contract which includes the contract functions.
 * @template TFunctionName - The names of the contract functions extracted from the ABI that are either 'pure' or 'view'.
 * @template TAbiFunction - The contract function extracted from the ABI based on the function name.
 */
type ContractFunctionRead<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
    TAbiFunction extends AbiFunction = ExtractAbiFunction<TAbi, TFunctionName>
> = Record<
    TFunctionName,
    ContractFunctionAsync<
        AbiParametersToPrimitiveTypes<TAbiFunction['outputs'], 'outputs'>,
        TAbiFunction
    >
>;

/**
 * Defines a mapping of contract function names to their corresponding transactional contract functions.
 * Each function in this record is expected to return a `Promise` that resolves to `SendTransactionResult`,
 * which should encapsulate the result of a transactional contract call (e.g., modifying state on the blockchain).
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunctionAsync` type with `SendTransactionResult` as the return type.
 *
 * @template TAbi - The ABI of the contract which includes the contract functions.
 * @template TFunctionName - The names of the contract functions extracted from the ABI that are either 'payable' or 'nonpayable'.
 * @template TAbiFunction - The contract function extracted from the ABI based on the function name.
 */
type ContractFunctionTransact<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<
        TAbi,
        'payable' | 'non payable'
    >,
    TAbiFunction extends AbiFunction = ExtractAbiFunction<TAbi, TFunctionName>
> = Record<
    TFunctionName,
    ContractFunctionAsync<SendTransactionResult, TAbiFunction>
>;

/**
 * Defines a mapping of contract function names to their corresponding filter contract functions.
 * Each function in this record is expected to return a `ContractFilter` instance, which can be used to
 * filter events emitted by the contract.
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunctionAsync` type with `ContractFilter` as the return type.
 */
type ContractFunctionFilter<
    TAbi extends Abi,
    TEventName extends ExtractAbiEventNames<TAbi>
> = Record<TEventName, ContractFunctionSync<ContractFilter>>;

/**
 * Defines a mapping of contract function names to their corresponding transactional contract functions.
 * Each function in this record is expected to return a value of type `TransactionClause`, which represents
 * a transaction clause that can be used to interact with the contract.
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunctionSync` type with `ContractClause` as the return type.
 */
type ContractFunctionClause<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
> = Record<TFunctionName, ContractFunctionSync<ContractClause>>;

/**
 * Defines a mapping of contract function names to their corresponding filter criteria contract functions.
 * Each function in this record is expected to return a value of type `FilterCriteria`, which represents
 * the criteria used to filter events emitted by the contract.
 */
type ContractFunctionCriteria<
    TAbi extends Abi,
    TEventName extends ExtractAbiEventNames<TAbi>
> = Record<TEventName, ContractFunctionSync<FilterCriteria>>;

/**
 * Represents the amount of VET to transfer in a transaction.
 */
interface TransactionValue {
    value: number;
}

export type {
    ContractFunctionAsync,
    ContractFunctionSync,
    ContractFunctionRead,
    ContractFunctionTransact,
    ContractFunctionFilter,
    ContractFunctionClause,
    ContractFunctionCriteria,
    TransactionValue
};
