import { type DataType, type ErrorCode, type ErrorType } from '../../types';
import { buildError } from '../error-builder';
import { stringifyData } from '../error-message-builder';

/**
 * Asserts that a given condition is true. If the condition is false, an error is thrown.
 *
 * @param {string} methodName - The name of the method or function being asserted.
 * @param {boolean} condition - The condition to be asserted.
 * @param {ErrorCode} code - The error code to be associated with the error if the condition is false.
 * @param {string} message - The error message to be associated with the error if the condition is false.
 * @param {DataType} [data] - Additional data to be associated with the error if the condition is false.
 * @param {unknown} [innerError] - The inner error to be associated with the error if the condition is false.
 *
 * @returns {void}
 *
 * @throws {Error} An error object if the condition is false.
 *
 * @remarks
 * **IMPORTANT: no sensitive data should be passed as any parameter.**
 */
function assert<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(
    methodName: string,
    condition: boolean,
    code: ErrorCodeT,
    message: string,
    data?: DataTypeT,
    innerError?: unknown
): void {
    // Error to throw if the condition is false.
    const error = buildError(
        `Assertion on ${methodName}`,
        code,
        message,
        data,
        innerError
    ) as ErrorType<ErrorCodeT> as Error;

    if (!condition && typeof error === 'object') throw error;
}

/**
 * Asserts that the given error is an instance of the Error class.
 * If the error is an instance of Error, it is returned.
 * If the error is not an instance of Error, a new Error object is created with a descriptive message.
 *
 * @param {unknown} error - The error to be asserted.
 * @return {Error} - The error if it is an instance of Error, or a new Error object if it is not.
 *
 * @remarks
 * **IMPORTANT: no sensitive data should be passed as any parameter.**
 */
function assertInnerError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    return new Error(
        `Inner error is not an instance of Error. Object:\n\t${stringifyData(error)}`
    );
}

export { assert, assertInnerError };
