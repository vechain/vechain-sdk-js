/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';
import type { ContractFilter } from './ContractFilter';

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

