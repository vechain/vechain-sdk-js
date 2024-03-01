import {
    type DataType,
    ErrorClassMap,
    type ErrorCode,
    type ErrorType
} from '../../types';
import { assertInnerError } from '../assert';
import { buildErrorMessage } from '../error-message-builder';

/**
 * Build error object according to the error code provided.
 * The error code determines the error type returned and the data type to be provided.
 * @param methodName - The method name where the error was thrown.
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
    methodName: string,
    code: ErrorCodeT,
    message: string,
    data?: DataTypeT,
    innerError?: unknown
): ErrorType<ErrorCodeT> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }

    // Error message
    const errorMessage = buildErrorMessage<ErrorCodeT, DataTypeT>(
        methodName,
        message,
        data as DataTypeT,
        innerError === undefined ? undefined : assertInnerError(innerError)
    );

    const error = new ErrorClass({
        code,
        message: errorMessage,
        data,
        innerError:
            innerError === undefined ? undefined : assertInnerError(innerError)
    });

    return error as ErrorType<ErrorCodeT>;
}

export { buildError };
