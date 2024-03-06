import { ErrorBase } from '../base';

/**
 * POLL Error.
 */
interface PollErrorData {
    message?: string;
    functionName?: string;
}

/**
 * Client error to be thrown when a http request fails.
 */
class PollExecutionError extends ErrorBase<
    POLL_ERROR.POLL_EXECUTION_ERROR,
    PollErrorData
> {}

/**
 * Errors enum.
 */
enum POLL_ERROR {
    POLL_EXECUTION_ERROR = 'POLL_EXECUTION_ERROR'
}

export { type PollErrorData, PollExecutionError, POLL_ERROR };
