import { ErrorBase } from '../base';

/**
 * HTTP Client Error.
 */
interface HTTPClientErrorData {
    status?: number;
    method?: string;
    url?: string;
    text?: string;
    message?: string;
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
class HTTPClientError extends ErrorBase<
    HTTP_CLIENT.INVALID_HTTP_REQUEST,
    HTTPClientErrorData
> {}

/**
 * Errors enum.
 */
enum HTTP_CLIENT {
    INVALID_HTTP_REQUEST = 'INVALID_HTTP_REQUEST'
}

export { type HTTPClientErrorData, HTTPClientError, HTTP_CLIENT };
