export class FilterOptions {
    /**
     Defaults to all results at the API level if not set
     **/
    readonly limit: number | null;

    /**
     Defaults to 0 at the API level if not set
     **/
    readonly offset: number | null;

    /**
     Defaults to false at the API level if not set
     **/
    readonly includeIndexes: boolean | null;

    /**
     * Constructs a new FilterOptions instance.
     *
     * @param limit - The limit of the filter options.
     * @param offset - The offset of the filter options.
     * @param includeIndexes - Whether to include indexes in the filter options.
     */
    constructor(limit?: number, offset?: number, includeIndexes?: boolean) {
        this.limit = limit ?? null;
        this.offset = offset ?? null;
        this.includeIndexes = includeIndexes ?? null;
    }

    /**
     * Creates a new FilterOptions instance.
     *
     * @param limit - The limit of the filter options.
     * @param offset - The offset of the filter options.
     * @param includeIndexes - Whether to include indexes in the filter options.
     */
    static of(
        limit: number,
        offset: number,
        includeIndexes: boolean
    ): FilterOptions {
        return new FilterOptions(limit, offset, includeIndexes);
    }
}
