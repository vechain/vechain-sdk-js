import type { ContractClause } from '@vechain/sdk-core';
import type {
    Abi,
    AbiParametersToPrimitiveTypes,
    ExtractAbiEvent,
    ExtractAbiFunction
} from 'abitype';
import type { SendTransactionResult } from '../../transactions/types';
import type { ContractFilter } from './contract-filter';

/**
 * Additional options that can be passed to contract function calls
 */
interface ClauseAdditionalOptions {
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
type TransactionValue = string | number | bigint;

/**
 * Clause comment type
 */
type ClauseComment = string;

/**
 * Clause revision type
 */
type ClauseRevision = string | number;

/**
 * Contract function read interface - for view/pure functions
 */
type ContractFunctionRead<
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
type ContractFunctionTransact<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (
        ...args: unknown[]
    ) => Promise<SendTransactionResult>;
};

/**
 * Contract function filter interface - for events
 */
type ContractFunctionFilter<
    TAbi extends Abi,
    TEventNames extends string
> = {
    [K in TEventNames]: (
        args?: Record<string, unknown> | unknown[] | undefined
    ) => ContractFilter<TAbi>;
};

/**
 * Contract function clause interface - for building transaction clauses
 */
type ContractFunctionClause<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (...args: unknown[]) => ContractClause;
};

/**
 * Contract function criteria interface - for event criteria
 */
type ContractFunctionCriteria<
    TAbi extends Abi,
    TEventNames extends string
> = {
    [K in TEventNames]: (
        args?: Record<string, unknown> | unknown[] | undefined
    ) => unknown; // FilterCriteria type would go here
};

export type {
    ClauseAdditionalOptions,
    TransactionValue,
    ClauseComment,
    ClauseRevision,
    ContractFunctionRead,
    ContractFunctionTransact,
    ContractFunctionFilter,
    ContractFunctionClause,
    ContractFunctionCriteria
};
