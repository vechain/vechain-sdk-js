import { ethers } from 'ethers';

// Our core library
export * from './abi';
export * from './certificate';
export * from './clause';
export * from './contract';
export * from './encoding';
export * from './vcdm/hash/Hash';
export * from './hdkey';
export * from './keystore';
export * from './secp256k1';
export * from './transaction';
export * from './utils';
export * from './vcdm';

// Other libraries
export { ethers as vechain_sdk_core_ethers };
