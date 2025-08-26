import { type FilterOptionsJSON } from '@thor/json';
import { type FilterOptions } from '@thor/thor-client/model/logs/FilterOptions';

/**
 * Filter options for event logs.
 */
class FilterOptionsRequest {
    /**
     * The maximum number of results to return.
     */
    readonly limit?: number;

    /**
     * The offset for the results (allows for pagination).
     */
    readonly offset?: number;

    /**
     * Whether to include index information in the results.
     */
    readonly includeIndexes?: boolean;

    /**
     * Constructs an instance of the class.
     *
     * @param {number} limit - The maximum number of results to return.
     * @param {number} offset - The offset for the results (allows for pagination).
     * @param {boolean} includeIndexes - Whether to include index information in the results.
     */
    constructor(limit?: number, offset?: number, includeIndexes?: boolean) {
        this.limit = limit;
        this.offset = offset;
        this.includeIndexes = includeIndexes;
    }

    /**
     * Constructs an instance of the class from a FilterOptions.
     *
     * @param {FilterOptions} options - The FilterOptions to convert to a FilterOptionsRequest.
     * @return {FilterOptionsRequest} The FilterOptionsRequest instance created from the FilterOptions.
     */
    static of(options: FilterOptions): FilterOptionsRequest {
        return new FilterOptionsRequest(
            options.limit ?? undefined,
            options.offset ?? undefined,
            options.includeIndexes ?? undefined
        );
    }

    /**
     * Converts into a JSON representation.
     *
     * @return {FilterOptionsJSON} The JSON object representing the current FilterOptionsRequest instance.
     */
    toJSON(): FilterOptionsJSON {
        return {
            limit: this.limit ?? undefined,
            offset: this.offset ?? undefined,
            includeIndexes: this.includeIndexes ?? undefined
        } satisfies FilterOptionsJSON;
    }
}

export { FilterOptionsRequest };
