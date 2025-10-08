import { VeChainSDKError } from '@common/errors';

/**
 * Represents an HTTP error for non-200 responses.
 *
 * @remarks
 * This error class extends the `VeChainSDKError` and denotes HTTP errors encountered
 * when the server returns a non-200 status code (e.g., 400, 404, 500, etc.).
 * It includes additional information about the HTTP status code and response details.
 */
class HttpException extends VeChainSDKError {
    /**
     * The [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
     * returned by the server.
     */
    readonly status: number;

    /**
     * The HTTP status text returned by the server.
     */
    readonly statusText: string;

    /**
     * The response body as text.
     */
    readonly responseBody: string;

    /**
     * The URL that was requested.
     */
    readonly url: string;

    /**
     * Constructs a new instance of the class.
     *
     * @param {string} fqn - The fully qualified name associated with the instance.
     * @param {string} message - The message describing the instance context or error.
     * @param {number} status - The HTTP status code.
     * @param {string} statusText - The HTTP status text.
     * @param {string} responseBody - The response body as text.
     * @param {string} url - The URL that was requested.
     * @param {Record<string, unknown>} [args] - Optional additional arguments related to the instance.
     * @param {Error} [cause] - Optional underlying error that caused the issue.
     */
    // eslint-disable-next-line sonarjs/sonar-max-params
    constructor(
        fqn: string,
        message: string,
        status: number,
        statusText: string,
        responseBody: string,
        url: string,
        args?: Record<string, unknown>,
        cause?: Error
    ) {
        super(fqn, message, args, cause);
        this.status = status;
        this.statusText = statusText;
        this.responseBody = responseBody;
        this.url = url;
    }
}

export { HttpException };
