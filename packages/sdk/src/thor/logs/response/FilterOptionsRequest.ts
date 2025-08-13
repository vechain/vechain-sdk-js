import { UInt } from '@vcdm';
import { type FilterOptionsJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';
import { type FilterOptions } from '@thor/thor-client/model/logs/FilterOptions';

/**
 * Full-Qualified-Path(http://localhost:8669/doc/stoplight-ui/#/schemas/FilterOptions)
 */
const FQP = 'packages/sdk/src/thor/logs/FilterOptions.ts!';

class FilterOptionsRequest {
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
     * Constructs an instance of the class with the filter options represented as a JSON object.
     *
     * @param {FilterOptionsJSON} json - The JSON object containing filter options.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} Thrown when the provided JSON object contains invalid or unparsable data.
     */
    constructor(options: FilterOptions) {
        try {
            this.limit = options.limit;
            this.offset = options.offset;
            this.includeIndexes = options.includeIndexes;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: FilterOptionsJSON)`,
                'Unable to construct FilterOptionsRequest from FilterOptions',
                { options },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current FilterOptions instance into a JSON representation.
     *
     * @return {FilterOptionsJSON } The JSON object representing the current FilterOptions instance.
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
