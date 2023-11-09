/**
 * Constructs a query object for HTTP requests by filtering out undefined values.
 *
 * @param params - An object containing the query parameters with potential undefined values.
 * @returns An object containing only the defined query parameters.
 */
const buildQuery = (
    params: Record<string, string | boolean | undefined>
): Record<string, string> => {
    const definedParams: Record<string, string> = {};

    // Iterate over each property in the params object
    for (const key in params) {
        // Check if the value is not undefined
        if (params[key] !== undefined) {
            // If the value is defined, add it to the definedParams object
            definedParams[key] = params[key] as string;
        }
    }

    return definedParams;
};

export { buildQuery };
