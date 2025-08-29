import { VeChainSDKError } from '@common/errors';

/**
 * Represents an error originating from the Thor REST API.
 *
 * @remarks
 * This error class extends the `VeChainSDKError` and denotes errors encountered while interacting
 * with the Thor REST API. It includes additional information about the HTTP status code returned
 * from the Thor REST endpoint during an error response.
 */
class ThorError extends VeChainSDKError {
    /**
     * The [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
     * returned by the Thor REST end-point in case of error.
     *
     * @remarks
     * The `status` value is zero if the error is not originated by any response from the Thor REST end-point,
     */
    readonly status: number;

    /**
     * Constructs a new instance of the class.
     *
     * @param {string} fqn - The fully qualified name associated with the instance.
     * @param {string} message - The message describing the instance context or error.
     * @param {Record<string, unknown>} [args] - Optional additional arguments related to the instance.
     * @param {Error} [cause] - Optional underlying error that caused the issue.
     * @param {number} [status=0] - The optional status code; defaults to 0.
     */
    constructor(
        fqn: string,
        message: string,
        args?: Record<string, unknown>,
        cause?: Error,
        status: number = 0
    ) {
        super(fqn, message, args, cause);
        this.status = status;
    }
}

export { ThorError };
