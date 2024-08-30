import { ethers } from 'ethers';

// Our core library
// TODO: Delete/move these types/values
export {
    type FormatType,
    type FunctionFragment,
    type InterfaceAbi,
    type EventFragment,
    type Log,
    fragment
} from './abi';
export * from './certificate';
export * from './clause';
export * from './contract';
export * from './encoding';
export * from './hash';
export * from './hdnode';
export * from './keystore';
export * from './secp256k1';
export * from './transaction';
export * from './utils';
export * from './vcdm';

// Other libraries
export { ethers as vechain_sdk_core_ethers };
