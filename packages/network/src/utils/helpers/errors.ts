import { type AxiosError } from 'axios';
import {
    buildError,
    HTTP_CLIENT,
    type HTTPClientError
} from '@vechain/vechain-sdk-errors';

/**
 * Converts an AxiosError into a standard Error.
 *
 * This function converts an AxiosError, which may contain HTTP response details, into a standard Error.
 * It handles cases where the AxiosError has an HTTP response with status and data.
 *
 * @param error - The AxiosError to convert into an Error.
 * @returns A standard Error with a descriptive message.
 */
const convertError = (error: AxiosError): HTTPClientError => {
    // Error has a response
    if (error.response != null) {
        const resp = error.response;

        return buildError(
            HTTP_CLIENT.INVALID_HTTP_REQUEST,
            `An error occurred while performing http request ${error.config?.url}`,
            {
                status: resp.status,
                method: error.config?.method,
                url: error.config?.url,
                text:
                    typeof resp.data === 'string' ? resp.data.trim() : undefined
            }
        );
    }
    // Error does not have a response
    else {
        return buildError(
            HTTP_CLIENT.INVALID_HTTP_REQUEST,
            `An error occurred while performing http request ${error.config?.url}`,
            {
                method: error.config?.method,
                url: error.config?.url,
                message: error.message
            }
        );
    }
};

export { convertError };
