import { Keccak256, Txt } from '@vechain/sdk-core';

/**
 * The selector of the `Error(string)` function in Solidity.
 */
const SOLIDITY_ERROR_SELECTOR = Keccak256.of(Txt.of('Error(string)').bytes)
    .toString()
    .slice(0, 10);

/**
 * The selector of the `Panic(uint256)` function in Solidity.
 */
const SOLIDITY_PANIC_SELECTOR = Keccak256.of(Txt.of('Panic(uint256)').bytes)
    .toString()
    .slice(0, 10);

export { SOLIDITY_ERROR_SELECTOR, SOLIDITY_PANIC_SELECTOR };
