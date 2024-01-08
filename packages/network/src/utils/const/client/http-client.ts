/**
 * Default timeout for HTTP requests, in milliseconds.
 */
const DEFAULT_HTTP_TIMEOUT = 30000;

/**
 * HTTP regex.
 */
const HTTP_REGEX: RegExp = /^http:\/\//;

/**
 * HTTPS regex.
 */
const HTTPS_REGEX: RegExp = /^https:\/\//;

export { DEFAULT_HTTP_TIMEOUT, HTTP_REGEX, HTTPS_REGEX };
