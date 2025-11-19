"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQuery = void 0;
/**
 * Constructs a query object for HTTP requests by filtering out undefined values.
 *
 * @param params - An object containing the query parameters with potential undefined values.
 * @returns An object containing only the defined query parameters.
 */
const buildQuery = (params) => {
    const definedParams = {};
    // Iterate over each property in the params object
    for (const key in params) {
        // Check if the value is not undefined
        if (params[key] !== undefined) {
            // If the value is defined, add it to the definedParams object
            definedParams[key] = params[key];
        }
    }
    return definedParams;
};
exports.buildQuery = buildQuery;
