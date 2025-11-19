/**
 * Generates a query string from a record of key-value pairs.
 * Only includes keys in the query string whose values are defined.
 *
 * @param params - The record of key-value pairs.
 * @returns The query string.
 */
declare const toQueryString: (params: Record<string, string | number | boolean | undefined>) => string;
/**
 * Sanitizes a base URL by removing trailing slashes and adding the protocol if missing.
 *
 * @param url - The URL to validate.
 * @returns The sanitized URL without the protocol.
 * @throws {InvalidDataType}
 */
declare const sanitizeWebsocketBaseURL: (url: string) => string;
export { toQueryString, sanitizeWebsocketBaseURL };
//# sourceMappingURL=helpers.d.ts.map