/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';
import type { Clause } from '@thor/thor-client/model/transactions/Clause';

/**
 * Contract function clause interface - for building transaction clauses
 */
export type ContractFunctionClause<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (...args: AbiParameter[]) => Clause;
};
