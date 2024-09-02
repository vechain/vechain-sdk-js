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

export { InvalidHTTPRequest };
