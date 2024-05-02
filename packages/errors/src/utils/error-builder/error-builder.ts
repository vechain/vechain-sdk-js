import {
    type DataType,
    ErrorClassMap,
    type ErrorCode,
    type ErrorType
} from '../../types';
import { assertInnerError } from '../assert';
import { buildErrorMessage } from '../error-message-builder';

/**
 * Builds an error object with the error code provided and specified parameters.
 *
 * @param {string} methodName - The name of the method where the error occurred.
 * @param {ErrorCodeT} code - The error code.
 * @param {string} message - The error message.
 * @param {DataTypeT} [data] - Additional data associated with the error.
 * @param {unknown} [innerError] - An inner error associated with the error.
 *
 * @returns {ErrorType<ErrorCodeT>} - The error object.
 *
 * @throws {Error} - If the error code is invalid.
 *
 * @remarks
 * **IMPORTANT: no sensitive data should be passed as any parameter.**
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
