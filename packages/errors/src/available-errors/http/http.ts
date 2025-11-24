import { VechainSDKError } from '../sdk-error';

/**
 * Http invalid request error
 *
 * WHEN TO USE:
 * * Error will be thrown when an invalid HTTP request fails
 */
class InvalidHTTPRequest extends VechainSDKError<{
    method: string;
    url: string;
}> {}

/**
 * Http invalid params error
 *
 * WHEN TO USE:
 * * Error will be thrown when HTTP request params are invalid
 */
class InvalidHTTPParams extends VechainSDKError<{
    method: string;
    url: string;
}> {}

/**
 * Http network communication error
 *
 * WHEN TO USE:
 * * Error will be thrown when network communication fails (timeout, connection reset, etc.)
 * * This is different from HTTP protocol errors (4xx/5xx responses)
 */
class HttpNetworkError extends VechainSDKError<{
    method: string;
    url: string;
    networkErrorType?: string;
}> {}

export { InvalidHTTPRequest, InvalidHTTPParams, HttpNetworkError };
