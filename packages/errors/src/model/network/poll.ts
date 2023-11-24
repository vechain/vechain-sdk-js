import { ErrorBase } from '../base';

/**
 * POLL Error.
 */
interface PollErrorData {
    message?: string;
    functionName?: string;
}

/**
 * Client error to be thrown when an http request fails.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 *
 * @returns The error object.
 */
class PoolExecutionError extends ErrorBase<
    POLL_ERROR.POOLL_EXECUTION_ERROR,
    PollErrorData
> {}

/**
 * Errors enum.
 */
enum POLL_ERROR {
    POOLL_EXECUTION_ERROR = 'POOLL_EXECUTION_ERROR'
}

export { type PollErrorData, PoolExecutionError, POLL_ERROR };
