import type { ContractClause } from '../types';
import type { SendTransactionResult } from '../../transactions';
import { type ContractFilter } from './contract-filter';
import type {
    FilterCriteria,
    Range,
    PaginationOptions,
    EventDisplayOrder
} from '../../logs';
import {
    type Abi,
    type ExtractAbiFunctionNames,
    type ExtractAbiFunction,
    type AbiParametersToPrimitiveTypes,
    type AbiFunction,
    type ExtractAbiEvent
} from 'abitype';
import { type GetEventArgs } from 'viem';

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
type ContractFunctionSync<T = unknown, TABIFunction> = (
    ...args: [
        ...Partial<{ value: number; comment: string }>,
        ...AbiParametersToPrimitiveTypes<TABIFunction['inputs'], 'inputs'>
    ]
) => T;

/**
 * Defines a synchronous function type for handling contract events.
 *
 * @template T - The return type of the contract event function. Defaults to `unknown`.
 * @template TAbiEvent - The ABI event type for the contract event.
 *
 * This type represents a function that takes a variable number of arguments, which are partial
 * representations of the input parameters defined in the ABI for the event, and returns a value of type `T`.
 */
type ContractEventSync<T = unknown, TABIEvent> = (
    ...args: Partial<
        AbiParametersToPrimitiveTypes<TABIEvent['inputs'], 'inputs'>
    >
) => T;

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
type ContractFunctionAsync<T = unknown, TABIFunction> = (
    ...args: [
        ...Partial<{ value: number; comment: string }>,
        ...AbiParametersToPrimitiveTypes<TABIFunction['inputs'], 'inputs'>
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
 * Defines a mapping of contract event names to their corresponding filter criteria contract functions.
 * Each function in this record is expected to return a value of type `ContractFilter`, which represents
 * a filter that can be used to query events emitted by the contract.
 * The keys of this record represent the names of the contract events, and the values are the contract
 * functions themselves.
 * @template TAbi - The ABI (Application Binary Interface) of the contract.
 * @template TEventNames - The names of the events extracted from the ABI.
 * @template TAbiEvent - The event type extracted from the ABI for a given event name.
 */
type ContractFunctionFilter<
    TAbi extends Abi,
    TEventNames extends string,
    TABIEvent extends AbiFunction = ExtractAbiEvent<TAbi, TEventNames>
> = {
    [K in TEventNames]: (
        args?:
            | GetEventArgs<TAbi, K>
            | Partial<
                  AbiParametersToPrimitiveTypes<TABIEvent['inputs'], 'inputs'>
              >
    ) => ContractFilter<TAbi>;
};
/**
 * Defines a mapping of contract function names to their corresponding transactional contract functions.
 * Each function in this record is expected to return a value of type `TransactionClause`, which represents
 * a transaction clause that can be used to interact with the contract.
 *
 * The keys of this record represent the names of the contract functions, and the values are the contract
 * functions themselves, adhering to the `ContractFunctionSync` type with `ContractClause` as the return type.
 *
 * @template TAbi - The ABI (Application Binary Interface) of the contract.
 * @template TFunctionName - The names of the functions extracted from the ABI, restricted to 'pure' or 'view' functions.
 * @template TAbiFunction - The function type extracted from the ABI for a given function name.
 */
type ContractFunctionClause<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
    TAbiFunction extends AbiFunction = ExtractAbiFunction<TAbi, TFunctionName>
> = Record<TFunctionName, ContractFunctionSync<ContractClause, TAbiFunction>>;

/**
 * Defines a mapping of contract event names to their corresponding filter criteria contract functions.
 * Each function in this record is expected to return a value of type `FilterCriteria`, which represents
 * a filter that can be used to query events emitted by the contract.
 * The keys of this record represent the names of the contract events, and the values are the contract
 * functions themselves.
 * @template TAbi - The ABI (Application Binary Interface) of the contract.
 * @template TEventNames - The names of the events extracted from the ABI.
 * @template TABIEvent - The event type extracted from the ABI for a given event name.
 */
type ContractFunctionCriteria<
    TAbi extends Abi,
    TEventNames extends string,
    TABIEvent extends AbiFunction = ExtractAbiEvent<TAbi, TEventNames>
> = {
    [K in TEventNames]: (
        args?:
            | GetEventArgs<TAbi, K>
            | Partial<
                  AbiParametersToPrimitiveTypes<TABIEvent['inputs'], 'inputs'>
              >
    ) => FilterCriteria;
};

/**
 * Represents the amount of VET to transfer in a transaction.
 */
interface TransactionValue {
    value: number;
}

/**
 * Represents a comment for a transaction clause.
 */
interface ClauseComment {
    comment: string;
}

/**
 * Represents the revision of a transaction clause.
 */
interface ClauseRevision {
    revision: string;
}

/**
 * Represents additional options for a transaction clause.
 */
interface ClauseAdditionalOptions {
    value: number | undefined;
    comment: string | undefined;
    revision: string | undefined;
}

/**
 * Represents the options for the get method of the `ContractFilter` class.
 */
interface TransferFilterOptions {
    range?: Range;
    options?: PaginationOptions;
    order?: EventDisplayOrder;
}

export type {
    ContractFunctionAsync,
    ContractFunctionSync,
    ContractFunctionRead,
    ContractFunctionTransact,
    ContractFunctionFilter,
    ContractFunctionClause,
    ContractFunctionCriteria,
    TransactionValue,
    ClauseComment,
    ClauseRevision,
    ClauseAdditionalOptions,
    TransferFilterOptions
};
