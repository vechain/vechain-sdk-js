import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid data error to be thrown when an invalid data is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidDataTypeError extends ErrorBase<
    DATA.INVALID_DATA_TYPE,
    DefaultErrorData
> {}

/**
 * Invalid return type given as input.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidDataReturnTypeError extends ErrorBase<
    DATA.INVALID_DATA_RETURN_TYPE,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum DATA {
    INVALID_DATA_TYPE = 'INVALID_DATA_TYPE',
    INVALID_DATA_RETURN_TYPE = 'INVALID_DATA_RETURN_TYPE'
}

export { InvalidDataTypeError, InvalidDataReturnTypeError, DATA };
