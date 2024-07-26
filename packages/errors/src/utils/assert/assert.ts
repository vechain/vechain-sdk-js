import { stringifyData } from '../error-message-builder';

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

export { assertInnerError };
