import { type AxiosError } from 'axios';

/**
 * Converts an AxiosError into a standard Error.
 *
 * This function converts an AxiosError, which may contain HTTP response details, into a standard Error.
 * It handles cases where the AxiosError has an HTTP response with status and data.
 *
 * @param err - The AxiosError to convert into an Error.
 * @returns A standard Error with a descriptive message.
 */
export function convertError(err: AxiosError): Error {
    if (err.response != null) {
        const resp = err.response;
        if (typeof resp.data === 'string') {
            let text = resp.data.trim();
            if (text.length > 50) {
                text = text.slice(0, 50) + '...';
            }
            return new Error(
                `${resp.status} ${err.config?.method} ${err.config?.url}: ${text}`
            );
        } else {
            return new Error(
                `${resp.status} ${err.config?.method} ${err.config?.url}`
            );
        }
    } else {
        return new Error(
            `${err.config?.method} ${err.config?.url}: ${err.message}`
        );
    }
}
