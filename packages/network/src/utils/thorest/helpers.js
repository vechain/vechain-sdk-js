"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeWebsocketBaseURL = exports.toQueryString = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const const_1 = require("../const");
/**
 * Generates a query string from a record of key-value pairs.
 * Only includes keys in the query string whose values are defined.
 *
 * @param params - The record of key-value pairs.
 * @returns The query string.
 */
const toQueryString = (params) => {
    // Filter out undefined values and map to 'key=value' strings
    const queryParts = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    // Join the parts with '&' and prepend a '?' if not empty
    return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
};
exports.toQueryString = toQueryString;
/**
 * Sanitizes a base URL by removing trailing slashes and adding the protocol if missing.
 *
 * @param url - The URL to validate.
 * @returns The sanitized URL without the protocol.
 * @throws {InvalidDataType}
 */
const sanitizeWebsocketBaseURL = (url) => {
    // Clean the url
    url = url.trim();
    // Simplified regex to check if the URL is valid
    const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)(:\d+)?\/?$/;
    if (!urlRegex.test(url))
        throw new sdk_errors_1.InvalidDataType('sanitizeWebsocketBaseURL()', `Invalid url: ${url}. Must adhere to the regex: ${urlRegex}.`, { url, urlRegex });
    // Remove trailing slash
    url = url.replace(/\/$/, '');
    // Replace http with ws and https with wss
    url =
        const_1.HTTP_REGEX.exec(url) !== null
            ? url.replace(const_1.HTTP_REGEX, 'ws://')
            : url.replace(const_1.HTTPS_REGEX, 'wss://');
    return url;
};
exports.sanitizeWebsocketBaseURL = sanitizeWebsocketBaseURL;
