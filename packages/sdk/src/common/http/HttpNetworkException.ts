import { VeChainSDKError } from '@common/errors';

/**
 * Represents a network error for connection issues, timeouts, or no response.
 *
 * @remarks
 * This error class extends the `VeChainSDKError` and denotes network errors encountered
 * when there are connection issues, timeouts, or when no response is received from the server.
 * It includes additional information about the network error type and request details.
 */
class HttpNetworkException extends VeChainSDKError {
    /**
     * The type of network error that occurred.
     */
    readonly networkErrorType:
        | 'timeout'
        | 'connection'
        | 'no_response'
        | 'abort';

    /**
     * The URL that was requested.
     */
    readonly url: string;

    /**
     * Constructs a new instance of the class.
     *
     * @param {string} fqn - The fully qualified name associated with the instance.
     * @param {string} message - The message describing the instance context or error.
     * @param {string} networkErrorType - The type of network error that occurred.
     * @param {string} url - The URL that was requested.
     * @param {Record<string, unknown>} [args] - Optional additional arguments related to the instance.
     * @param {Error} [cause] - Optional underlying error that caused the issue.
     */
    constructor(
        fqn: string,
        message: string,
        networkErrorType: 'timeout' | 'connection' | 'no_response' | 'abort',
        url: string,
        args?: Record<string, unknown>,
        cause?: Error
    ) {
        super(fqn, message, args, cause);
        this.networkErrorType = networkErrorType;
        this.url = url;
    }
}

export { HttpNetworkException };
