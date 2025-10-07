import type {
    Abi,
    AbiParametersToPrimitiveTypes,
    ExtractAbiEvent,
    ExtractAbiFunction
} from 'abitype';
import type { ContractClause } from './Clause';

/**
 * Additional options that can be passed to contract function calls
 */
export interface ClauseAdditionalOptions {
    /**
     * The value to send with the transaction (in wei)
     */
    value?: string | number | bigint;

    /**
     * A comment to include with the clause
     */
    comment?: string;

    /**
     * The revision to use for the call
     */
    revision?: string | number;
}

/**
 * Transaction value type
 */
export type TransactionValue = string | number | bigint;

/**
 * Clause comment type
 */
export type ClauseComment = string;

/**
 * Clause revision type
 */
export type ClauseRevision = string | number;

/**
 * Contract function read interface - for view/pure functions
 */
export type ContractFunctionRead<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (
        ...args: AbiParametersToPrimitiveTypes<
            ExtractAbiFunction<TAbi, K>['inputs'],
            'inputs'
        >
    ) => Promise<unknown[]>;
};

/**
 * Contract function transact interface - for payable/nonpayable functions
 */
export type ContractFunctionTransact<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (...args: unknown[]) => Promise<unknown>; // SendTransactionResult type
};

/**
 * Contract function filter interface - for events
 */
export type ContractFunctionFilter<
    TAbi extends Abi,
    TEventNames extends string
> = {
    [K in TEventNames]: (
        args?: Record<string, unknown> | unknown[] | undefined
    ) => unknown; // ContractFilter type
};

/**
 * Contract function clause interface - for building transaction clauses
 */
export type ContractFunctionClause<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (...args: unknown[]) => ContractClause;
};

/**
 * Contract function criteria interface - for event criteria
 */
export type ContractFunctionCriteria<
    TAbi extends Abi,
    TEventNames extends string
> = {
    [K in TEventNames]: (
        args?: Record<string, unknown> | unknown[] | undefined
    ) => unknown; // FilterCriteria type
};
