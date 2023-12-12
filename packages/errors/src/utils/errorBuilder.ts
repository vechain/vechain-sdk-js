import type { DataType, ErrorCode, ErrorType } from '../types';

import { ErrorClassMap } from '../types';

/**
 * Build error object according to the error code provided.
 * The error code determines the error type returned and the data type to be provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @param innerError - The inner error.
 * @returns the error object.
 */
function buildError<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(
    code: ErrorCodeT,
    message: string,
    data?: DataTypeT,
    innerError?: unknown
): ErrorType<ErrorCodeT> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }

    const error = new ErrorClass({
        code,
        message,
        data,
        innerError:
            innerError === undefined ? undefined : assertInnerError(innerError)
    });

    return error as ErrorType<ErrorCodeT>;
}

/**
 * Assert that the inner error object is an instance of Error
 * @param error an unknown object to be asserted as an instance of Error
 * @returns an Error object
 */
function assertInnerError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    throw new Error('Inner error is not an instance of Error');
}

export { buildError, assertInnerError };
