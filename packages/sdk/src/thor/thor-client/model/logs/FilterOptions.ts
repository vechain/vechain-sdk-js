/**
 * Filter options for event or transfer logs.
 */
interface FilterOptions {
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
}

export type { FilterOptions };
