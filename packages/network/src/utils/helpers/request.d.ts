/**
 * Constructs a query object for HTTP requests by filtering out undefined values.
 *
 * @param params - An object containing the query parameters with potential undefined values.
 * @returns An object containing only the defined query parameters.
 */
declare const buildQuery: (params: Record<string, string | boolean | undefined>) => Record<string, string>;
export { buildQuery };
//# sourceMappingURL=request.d.ts.map