/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';

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
            | readonly unknown[]
            | undefined
    ) => {
        eventName: string;
        args: readonly unknown[];
        address: string;
        topics: string[];
    };
};
