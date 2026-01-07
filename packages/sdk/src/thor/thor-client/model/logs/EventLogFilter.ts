import { type EventCriteria } from './EventCriteria';
import { type FilterOptions } from './FilterOptions';
import { type FilterRange } from './FilterRange';
import { type LogSort } from './LogSort';

class EventLogFilter {
    /**
     * Defines the range for filtering. Setting values to null indicates the entire range.
     */
    readonly range?: FilterRange;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options?: FilterOptions;

    /**
     * Criteria to filter events. All fields are joined with the AND operator.
     */
    readonly criteriaSet?: EventCriteria[];

    /**
     * Specifies the order of the results. Use `asc` for ascending order, and `desc` for descending order.S
     */
    readonly order?: LogSort;

    /**
     * Constructs a new EventLogFilter instance.
     *
     * @param range - The range for filtering.
     * @param options - The options for filtering.
     * @param criteriaSet - The criteria to filter events.
     * @param order - The order of the results.
     */
    constructor(
        range?: FilterRange,
        options?: FilterOptions,
        criteriaSet?: EventCriteria[],
        order?: LogSort
    ) {
        this.range = range;
        this.options = options;
        this.criteriaSet = criteriaSet;
        this.order = order;
    }

    /**
     * Creates a new EventLogFilter instance.
     *
     * @param range - The range for filtering.
     * @param options - The options for filtering.
     * @param criteriaSet - The criteria to filter events.
     * @param order - The order of the results.
     * @return {EventLogFilter} A new EventLogFilter instance.
     */
    static of(
        range?: FilterRange,
        options?: FilterOptions,
        criteriaSet?: EventCriteria[],
        order?: LogSort
    ): EventLogFilter {
        return new EventLogFilter(range, options, criteriaSet, order);
    }
}

export { EventLogFilter };
