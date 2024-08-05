import { InvalidDataType } from '@vechain/sdk-errors';
import { HTTP_REGEX, HTTPS_REGEX } from '../const';

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
 * @throws {InvalidDataType}
 */
const sanitizeWebsocketBaseURL = (url: string): string => {
    // Clean the url
    url = url.trim();

    // Simplified regex to check if the URL is valid
    const urlRegex =
        /^(https?:\/\/)([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)(:\d+)?\/?$/;

    if (!urlRegex.test(url))
        throw new InvalidDataType(
            'sanitizeWebsocketBaseURL()',
            `Invalid url: ${url}. Must adhere to the regex: ${urlRegex}.`,
            { url, urlRegex }
        );

    // Remove trailing slash
    url = url.replace(/\/$/, '');

    // Replace http with ws and https with wss
    url =
        HTTP_REGEX.exec(url) !== null
            ? url.replace(HTTP_REGEX, 'ws://')
            : url.replace(HTTPS_REGEX, 'wss://');

    return url;
};

export { toQueryString, sanitizeWebsocketBaseURL };
