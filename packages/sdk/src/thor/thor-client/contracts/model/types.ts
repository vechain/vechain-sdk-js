import type {
    Abi,
    AbiParameter,
    AbiParametersToPrimitiveTypes,
    ExtractAbiFunction
} from 'abitype';
import type { Address, Hex } from '@common/vcdm';
import type { Clause } from '@thor/thor-client/model/transactions/Clause';
import type { ClauseOptions } from '@thor/thorest/transactions/model/ClauseOptions';
import type { ContractFilter } from './ContractFilter';

/**
 * Transaction value type
 */
export type TransactionValue = string | number | bigint;

/**
 * Send transaction result
 */
export interface SendTransactionResult {
    id: string;
    wait: () => Promise<{ id: string; blockNumber: number; blockHash: string }>;
}

/**
 * Contract-specific clause options that extend the main SDK's ClauseOptions
 */
export interface ContractClauseOptions extends ClauseOptions {
    /**
     * The value to send with the transaction (in wei)
     */
    value?: bigint;

    /**
     * The revision to use for the call
     */
    revision?: string | number;
}

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
    ) => Promise<(string | number | bigint | boolean | Address | Hex)[]>;
};

/**
 * Contract function transact interface - for payable/nonpayable functions
 */
export type ContractFunctionTransact<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (
        ...args: AbiParameter[]
    ) => Promise<SendTransactionResult>;
};

/**
 * Contract function filter interface - for events
 */
export type ContractFunctionFilter<
    TAbi extends Abi,
    TEventNames extends string
> = {
    [K in TEventNames]: (
        args?:
            | Record<string, string | number | bigint | boolean>
            | AbiParameter[]
            | undefined
    ) => ContractFilter<TAbi>;
};

/**
 * Contract function clause interface - for building transaction clauses
 */
export type ContractFunctionClause<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (...args: AbiParameter[]) => Clause;
};

/**
 * Contract function criteria interface - for event criteria
 */
export type ContractFunctionCriteria<
    TAbi extends Abi,
    TEventNames extends string
> = {
    [K in TEventNames]: (
        args?:
            | Record<string, string | number | bigint | boolean>
            | AbiParameter[]
            | undefined
    ) => {
        eventName: string;
        args: AbiParameter[];
        address: string;
        topics: string[];
    };
};
