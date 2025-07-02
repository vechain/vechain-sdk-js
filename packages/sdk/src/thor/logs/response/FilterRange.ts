import { UInt } from '@vcdm';
import { type FilterRangeUnits, type FilterRangeJSON } from '@thor';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/logs/FilterRange.ts!';

/**
 * [FilterRange](http://localhost:8669/doc/stoplight-ui/#/schemas/FilterRange)
 */
class FilterRange {
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
    constructor(json: FilterRangeJSON) {
        try {
            this.unit =
                typeof json.unit === 'string'
                    ? (json.unit as FilterRangeUnits)
                    : null;
            this.from =
                typeof json.from === 'number'
                    ? UInt.of(json.from).valueOf()
                    : null;
            this.to =
                typeof json.to === 'number' ? UInt.of(json.to).valueOf() : null;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: FilterRangeJSON)`,
                'Bad parse',
                { json },
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

export { FilterRange };
