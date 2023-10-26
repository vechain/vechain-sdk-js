import type { DefaultErrorData } from '../types';
import { ErrorBase } from './base';

/**
 * Invalid address error to be thrown when an invalid address is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidAddressError extends ErrorBase<
    ADDRESS.INVALID_ADDRESS,
    DefaultErrorData
> {}

/**
 * Errors enum.
 *
 * @public
 */
enum ADDRESS {
    INVALID_ADDRESS = 'INVALID_ADDRESS'
}

export { InvalidAddressError, ADDRESS };
