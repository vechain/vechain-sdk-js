import { type FilterRange } from './FilterRange';
import { type FilterOptions } from './FilterOptions';
import { type TransferCriteria } from './TransferCriteria';
import { type LogSort } from './LogSort';

/**
 * Filter options for transfer logs.
 */
export interface TransferLogFilter {
    /**
     * Defines the range for filtering. Setting values to null indicates the entire range.
     */
    readonly range?: FilterRange;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options?: FilterOptions;

    /**
     * Transfer criteria.
     */
    readonly criteriaSet?: TransferCriteria[];

    /**
     * Specifies the order of the results. Use asc for ascending order, and desc for descending order.
     */
    readonly order?: LogSort;
}
