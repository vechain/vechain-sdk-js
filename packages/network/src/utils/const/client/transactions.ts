import { Keccak256, Txt } from '@vechain/sdk-core';

/**
 * The selector for the error event.
 */
const ERROR_SELECTOR = Keccak256.of(Txt.of('Error(string)').bytes)
    .toString()
    .slice(0, 10);

/**
 * The selector for the panic event.
 */
const PANIC_SELECTOR = Keccak256.of(Txt.of('Panic(uint256)').bytes)
    .toString()
    .slice(0, 10);

export { ERROR_SELECTOR, PANIC_SELECTOR };
