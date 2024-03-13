import { keccak256 } from '@vechain/sdk-core';

/**
 * The selector of the `Error(string)` function in Solidity.
 */
const SOLIDITY_ERROR_SELECTOR = keccak256('Error(string)', 'hex').slice(0, 10);

/**
 * The selector of the `Panic(uint256)` function in Solidity.
 */
const SOLIDITY_PANIC_SELECTOR = keccak256('Panic(uint256)', 'hex').slice(0, 10);

export { SOLIDITY_ERROR_SELECTOR, SOLIDITY_PANIC_SELECTOR };
