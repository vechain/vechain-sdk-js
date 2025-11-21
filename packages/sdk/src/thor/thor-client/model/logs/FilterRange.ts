import { type FilterRangeUnits } from './FilterRangeUnits';

/**
 * Defines the range of blocks or timestamps for filtering events.
 */
interface FilterRange {
    /**
     * Specifies the unit of measurement for the from and to values.
     */
    readonly unit?: FilterRangeUnits;

    /**
     * Defines the starting block number or timestamp for the specified range.
     */
    readonly from?: number;

    /**
     * Specifies the ending block number or timestamp for the specified range.
     */
    readonly to?: number;
}

export type { FilterRange };
