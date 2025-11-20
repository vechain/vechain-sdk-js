export class FilterOptions {
    /**
     * The limit of the number of results to return.
     * Defaults to all results if not set
     * This actual number of results returned may be less depending on thor configuration
     **/
    readonly limit?: number;

    /**
     * The offset for the results (allows for pagination).
     * Defaults to 0 if not set
     **/
    readonly offset?: number;

    /**
     * Whether to include transaction and log indexes in the results.
     * Defaults to false if not set
     **/
    readonly includeIndexes?: boolean;

    /**
     * Constructs a new FilterOptions instance.
     *
     * @param limit - The limit of the filter options.
     * @param offset - The offset of the filter options.
     * @param includeIndexes - Whether to include indexes in the filter options.
     */
    constructor(limit?: number, offset?: number, includeIndexes?: boolean) {
        this.limit = limit;
        this.offset = offset;
        this.includeIndexes = includeIndexes;
    }

    /**
     * Creates a new FilterOptions instance.
     *
     * @param limit - The limit of the filter options.
     * @param offset - The offset of the filter options.
     * @param includeIndexes - Whether to include indexes in the filter options.
     */
    static of(
        limit?: number,
        offset?: number,
        includeIndexes?: boolean
    ): FilterOptions {
        return new FilterOptions(limit, offset, includeIndexes);
    }
}
