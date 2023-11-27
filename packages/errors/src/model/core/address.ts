import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid address error to be thrown when an invalid address is provided.
 */
class InvalidAddressError extends ErrorBase<
    ADDRESS.INVALID_ADDRESS,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum ADDRESS {
    INVALID_ADDRESS = 'INVALID_ADDRESS'
}

export { InvalidAddressError, ADDRESS };
