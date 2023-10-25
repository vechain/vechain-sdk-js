import type { DataType, ErrorCode, ErrorType } from '../types/errorTypes';

import { ErrorClassMap } from '../types/errorTypes';

/**
 * Build error object according to the the error code provided.
 * The error code determines the error type returned and the data type to be provided.
 * @param code
 * @param message
 * @param data
 * @returns the error object.
 */
function buildError<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(code: ErrorCodeT, message: string, data?: DataTypeT): ErrorType<ErrorCodeT> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }
    const error = new ErrorClass({ code, message, data });

    return error as ErrorType<ErrorCodeT>;
}

export { buildError };
