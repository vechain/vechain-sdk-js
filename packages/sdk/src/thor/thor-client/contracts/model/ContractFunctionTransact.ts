/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';
import type { Hex } from '@common/vcdm';

/**
 * Contract function transact interface - for payable/nonpayable functions
 */
export type ContractFunctionTransact<
    TAbi extends Abi,
    TFunctionNames extends string
> = {
    [K in TFunctionNames]: (
        ...args: readonly unknown[]
    ) => Promise<Hex>;
};
