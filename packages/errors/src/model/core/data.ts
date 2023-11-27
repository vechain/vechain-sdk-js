import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid data error to be thrown when an invalid data is detected.
 */
class InvalidDataTypeError extends ErrorBase<
    DATA.INVALID_DATA_TYPE,
    DefaultErrorData
> {}

/**
 * Invalid return type given as input.
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
