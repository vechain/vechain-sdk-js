import { DATA, buildError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Generates a query string from a record of key-value pairs.
 * Only includes keys in the query string whose values are defined.
 *
 * @param params - The record of key-value pairs.
 * @returns The query string.
 */
const toQueryString = (
    params: Record<string, string | number | boolean | undefined>
): string => {
    // Filter out undefined values and map to 'key=value' strings
    const queryParts = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    value as string
                )}`
        );

    // Join the parts with '&' and prepend a '?' if not empty
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
};

/**
 * Sanitizes a base URL by removing trailing slashes and adding the protocol if missing.
 *
 * @param url - The URL to validate.
 * @returns The sanitized URL without the protocol.
 */
const sanitizeWebsocketBaseURL = (url: string): string => {
    // Clean the url
    url = url.trim();

    // Simplified regex to check if the URL is valid
    const urlRegex =
        /^(https?:\/\/)([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)(:\d+)?\/?$/;

    if (!urlRegex.test(url))
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            `Invalid url: ${url}. Must adhere to the regex: ${urlRegex}`
        );

    // Remove trailing slashes
    url = url.replace(/\/+$/, '');

    // Replace http with ws and https with wss
    url = url.replace(/^http/, 'ws').replace(/^https/, 'wss');

    return url;
};

export { toQueryString, sanitizeWebsocketBaseURL };
