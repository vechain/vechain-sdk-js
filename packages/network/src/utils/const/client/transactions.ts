import { _keccak256 } from '@vechain/sdk-core';

/**
 * The selector for the error event.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const ERROR_SELECTOR = _keccak256('Error(string)', 'hex').slice(0, 10);

/**
 * The selector for the panic event.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const PANIC_SELECTOR = _keccak256('Panic(uint256)', 'hex').slice(0, 10);

export { ERROR_SELECTOR, PANIC_SELECTOR };
