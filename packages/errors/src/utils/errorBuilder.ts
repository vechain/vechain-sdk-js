import type { DataType, ErrorCode, ErrorType } from '../types';

import { ErrorClassMap } from '../types';

/**
 * Build error object according to the error code provided.
 * The error code determines the error type returned and the data type to be provided.
 * @param code
 * @param message
 * @param data
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

function assertInnerError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    throw new Error('Inner error is not an instance of Error');
}

export { buildError, assertInnerError };
