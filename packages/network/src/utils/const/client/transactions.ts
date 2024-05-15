import { keccak256 } from '@vechain/sdk-core';

/**
 * The selector for the error event.
 */
const ERROR_SELECTOR = keccak256('Error(string)', 'hex').slice(0, 10);

/**
 * The selector for the panic event.
 */
const PANIC_SELECTOR = keccak256('Panic(uint256)', 'hex').slice(0, 10);

export { ERROR_SELECTOR, PANIC_SELECTOR };
