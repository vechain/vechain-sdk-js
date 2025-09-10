import { type FilterRangeUnits } from './FilterRangeUnits';

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
     * Constructs a new FilterRange instance.
     *
     * @param unit - The unit of measurement for the from and to values.
     * @param from - The starting block number or timestamp for the specified range.
     * @param to - The ending block number or timestamp for the specified range.
     */
    constructor(unit: FilterRangeUnits, from?: number, to?: number) {
        this.unit = unit;
        this.from = from ?? null;
        this.to = to ?? null;
    }

    /**
     * Creates a new FilterRange instance.
     *
     * @param unit - The unit of measurement for the from and to values.
     * @param from - The starting block number or timestamp for the specified range.
     * @param to - The ending block number or timestamp for the specified range.
     */
    static of(unit: FilterRangeUnits, from: number, to: number): FilterRange {
        return new FilterRange(unit, from, to);
    }
}

export { FilterRange };
