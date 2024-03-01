import { type DataType, type ErrorCode, type ErrorType } from '../../types';
import { buildError } from '../error-builder/error-builder';

/**
 * Assert that the condition is true, otherwise throw an error.
 *
 * @param condition - The condition to be asserted.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @param innerError - The inner error.
 */
function assert<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(
    condition: boolean,
    code: ErrorCodeT,
    message: string,
    data?: DataTypeT,
    innerError?: unknown
): void {
    // Error to throw if the condition is false.
    const error = buildError(
        code,
        message,
        data,
        innerError
    ) as ErrorType<ErrorCodeT> as Error;

    if (!condition && typeof error === 'object') throw error;
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

export { assert, assertInnerError };
