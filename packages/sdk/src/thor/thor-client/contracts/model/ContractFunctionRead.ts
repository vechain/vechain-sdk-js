/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type {
    Abi,
    AbiParameter,
    AbiParametersToPrimitiveTypes,
    ExtractAbiFunction
} from 'abitype';
import type { Address, Hex } from '@common/vcdm';

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

