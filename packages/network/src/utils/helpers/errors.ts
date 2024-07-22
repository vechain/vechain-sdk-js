import {
    buildError,
    HTTP_CLIENT,
    type HTTPClientError
} from '@vechain/sdk-errors';

/**
 * Converts a Fetch error into a standardized HTTPClientError.
 *
 * This function handles errors that may occur during a Fetch request, including network errors and HTTP errors.
 *
 * @param error - The error caught during the Fetch request.
 * @param url - The URL of the request that caused the error.
 * @param method - The HTTP method used for the request.
 * @returns A standardized HTTPClientError.
 */
const convertError = (
    error: unknown,
    url: string,
    method: string
): HTTPClientError => {
    if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        return buildError(
            'convertError',
            HTTP_CLIENT.INVALID_HTTP_REQUEST,
            `Invalid URL: ${url}`,
            {
                method,
                url,
                message: error.message
            }
        );
    } else if (error instanceof TypeError) {
        // Network error
        return buildError(
            'convertError',
            HTTP_CLIENT.INVALID_HTTP_REQUEST,
            `Network error occurred while performing HTTP request to ${url}`,
            {
                method,
                url,
                message: error.message
            }
        );
    } else if (error instanceof Response) {
        // HTTP error
        return buildError(
            'convertError',
            HTTP_CLIENT.INVALID_HTTP_REQUEST,
            `An error occurred while performing HTTP request to ${url}`,
            {
                status: error.status,
                method,
                url,
                text: error.statusText
            }
        );
    } else {
        // Unknown error
        return buildError(
            'convertError',
            HTTP_CLIENT.INVALID_HTTP_REQUEST,
            `An unknown error occurred while performing HTTP request to ${url}`,
            {
                method,
                url,
                message: error instanceof Error ? error.message : String(error)
            }
        );
    }
};

export { convertError };
