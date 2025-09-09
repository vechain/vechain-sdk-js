import { type FilterRangeUnits } from '@thor/thorest';
import { type FilterRangeJSON } from '@thor/thorest/json';
import { type FilterRange } from '@thor/thor-client/model/logs/FilterRange';

/**
 * Defines the range of blocks or timestamps for filtering events.
 */
class FilterRangeRequest {
    /**
     * The unit of measurement for the from and to values.
     */
    readonly unit?: FilterRangeUnits;

    /**
     * The starting block number or timestamp for the specified range.
     */
    readonly from?: number;

    /**
     * The ending block number or timestamp for the specified range.
     */
    readonly to?: number;

    /**
     * Constructs an instance of the class.
     *
     * @param {FilterRangeUnits} unit - The unit of measurement for the from and to values.
     * @param {number} from - The starting block number or timestamp for the specified range.
     * @param {number} to - The ending block number or timestamp for the specified range.
     */
    constructor(unit?: FilterRangeUnits, from?: number, to?: number) {
        this.unit = unit;
        this.from = from;
        this.to = to;
    }

    /**
     * Constructs an instance of the class from a FilterRange.
     *
     * @param {FilterRange} range - The FilterRange to convert to a FilterRangeRequest.
     * @return {FilterRangeRequest} The FilterRangeRequest instance created from the FilterRange.
     */
    static of(range: FilterRange): FilterRangeRequest {
        return new FilterRangeRequest(
            range.unit ?? undefined,
            range.from ?? undefined,
            range.to ?? undefined
        );
    }

    /**
     * Converts into a JSON representation.
     *
     * @return {FilterRangeJSON} The JSON object representing the current FilterRangeRequest instance.
     */
    toJSON(): FilterRangeJSON {
        return {
            unit: this.unit?.toString(),
            from: this.from ?? undefined,
            to: this.to ?? undefined
        } satisfies FilterRangeJSON;
    }
}

export { FilterRangeRequest };
