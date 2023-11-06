import { type AxiosError } from 'axios';

/**
 * Converts an AxiosError into a standard Error.
 *
 * This function converts an AxiosError, which may contain HTTP response details, into a standard Error.
 * It handles cases where the AxiosError has an HTTP response with status and data.
 *
 * @param error - The AxiosError to convert into an Error.
 * @returns A standard Error with a descriptive message.
 *
 * @TODO - Refactor using our error system (https://github.com/vechainfoundation/vechain-sdk/issues/192)
 */
const convertError = (error: AxiosError): Error => {
    if (error.response != null) {
        const resp = error.response;
        if (typeof resp.data === 'string') {
            let text = resp.data.trim();
            if (text.length > 50) {
                text = text.slice(0, 50) + '...';
            }
            return new Error(
                `${resp.status} ${error.config?.method} ${error.config?.url}: ${text}`
            );
        } else {
            return new Error(
                `${resp.status} ${error.config?.method} ${error.config?.url}`
            );
        }
    } else {
        return new Error(
            `${error.config?.method} ${error.config?.url}: ${error.message}`
        );
    }
};

export { convertError };
