import { type FilterRange } from './FilterRange';
import { type FilterOptions } from './FilterOptions';
import { type TransferCriteria } from './TransferCriteria';
import { type LogSort } from './LogSort';

export class TransferLogFilter {
    /**
     * Defines the range for filtering. Setting values to null indicates the entire range.
     */
    readonly range: FilterRange | null;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options: FilterOptions | null;

    /**
     * Transfer criteria.
     */
    readonly criteriaSet: TransferCriteria[] | null;

    /**
     * Specifies the order of the results. Use asc for ascending order, and desc for descending order.
     */
    readonly order: LogSort | null;

    /**
     * Constructs a new TransferLogFilterRequest instance.
     *
     * @param range - The range for filtering.
     * @param options - The filter options.
     * @param criteriaSet - The transfer criteria.
     * @param order - The order of the results.
     */
    constructor(
        range: FilterRange | null,
        options: FilterOptions | null,
        criteriaSet: TransferCriteria[] | null,
        order: LogSort | null
    ) {
        this.range = range;
        this.options = options;
        this.criteriaSet = criteriaSet;
        this.order = order;
    }

    /**
     * Creates a new TransferLogFilterRequest instance.
     *
     * @param range - The range for filtering.
     * @param options - The filter options.
     * @param criteriaSet - The transfer criteria.
     * @param order - The order of the results.
     */
    static of(
        range: FilterRange | null,
        options: FilterOptions | null,
        criteriaSet: TransferCriteria[] | null,
        order: LogSort | null
    ): TransferLogFilter {
        return new TransferLogFilter(range, options, criteriaSet, order);
    }
}
