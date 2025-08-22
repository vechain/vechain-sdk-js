import { type FilterRangeUnits } from '@thor';
import { type FilterRangeJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';
import { type FilterRange } from '@thor/thor-client/model/logs/FilterRange';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/FilterRange.ts!';

/**
 * [FilterRange](http://localhost:8669/doc/stoplight-ui/#/schemas/FilterRange)
 */
class FilterRangeRequest {
    /**
     * Specifies the unit of measurement for the from and to values.
     */
    readonly unit: FilterRangeUnits | null;

    /**
     * Defines the starting block number or timestamp for the specified range.
     */
    readonly from: number | null;

    /**
     * Specifies the ending block number or timestamp for the specified range.
     */
    readonly to: number | null;

    /**
     * Constructs an instance of the class with the filter range represented as a JSON object.
     *
     * @param {FilterOptionsJSON} json - The JSON object containing filter options.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} Thrown when the provided JSON object contains invalid or unparsable data.
     */
    constructor(range: FilterRange) {
        try {
            this.unit = range.unit;
            this.from = range.from;
            this.to = range.to;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: FilterRangeJSON)`,
                'Bad parse',
                { range },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current FilterRange instance into a JSON representation.
     *
     * @return {FilterRangeJSON} The JSON object representing the current FilterRange instance.
     */
    toJSON(): FilterRangeJSON {
        return {
            unit: this.unit === null ? undefined : this.unit.toString(),
            from: this.from ?? undefined,
            to: this.to ?? undefined
        } satisfies FilterRangeJSON;
    }
}

export { FilterRangeRequest };
