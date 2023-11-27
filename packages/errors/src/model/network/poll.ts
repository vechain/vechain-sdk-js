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
 */
class PollExecutionError extends ErrorBase<
    POLL_ERROR.POOLL_EXECUTION_ERROR,
    PollErrorData
> {}

/**
 * Errors enum.
 */
enum POLL_ERROR {
    POOLL_EXECUTION_ERROR = 'POOLL_EXECUTION_ERROR'
}

export { type PollErrorData, PollExecutionError, POLL_ERROR };
