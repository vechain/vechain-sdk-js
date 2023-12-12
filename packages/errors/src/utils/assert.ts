import { type DataType, type ErrorCode, type ErrorType } from '../types';
import { buildError } from './errorBuilder';

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

export { assert };
