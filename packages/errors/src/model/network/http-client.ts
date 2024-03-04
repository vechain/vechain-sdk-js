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
 * Client error to be thrown when a http request fails.
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
