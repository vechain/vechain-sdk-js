import {
    FilterOptionsRequest,
    FilterRangeRequest,
    TransferCriteriaRequest
} from '@thor/thorest/logs';
import { type TransferLogFilterRequestJSON } from '@thor/thorest/json';
import { TransferLogFilter } from '@thor/thor-client/model/logs/TransferLogFilter';
import { LogSort } from './LogSort';

/**
 * Overall filter request for transfer logs.
 */
class TransferLogFilterRequest {
    /**
     * The range for filtering.
     */
    readonly range?: FilterRangeRequest;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options?: FilterOptionsRequest;

    /**
     * Transfer criteria.
     */
    readonly criteriaSet?: TransferCriteriaRequest[];

    /**
     * Specifies the order of the results. Use asc for ascending order, and desc for descending order.
     */
    readonly order?: LogSort;

    /**
     * Constructs an instance of the class.
     *
     * @param {FilterRangeRequest} range - The range for filtering.
     * @param {FilterOptionsRequest} options - Include these parameters to receive filtered results in a paged format.
     * @param {TransferCriteriaRequest[]} criteriaSet - Transfer criteria.
     * @param {LogSort} order - Specifies the order of the results. Use asc for ascending order, and desc for descending order.
     */
    constructor(
        range?: FilterRangeRequest,
        options?: FilterOptionsRequest,
        criteriaSet?: TransferCriteriaRequest[],
        order?: LogSort
    ) {
        this.range = range;
        this.options = options;
        this.criteriaSet = criteriaSet;
        this.order = order;
    }

    /**
     * Creates a new TransferLogFilterRequest instance.
     *
     * @param filter - The TransferLogFilter instance to convert.
     * @return {TransferLogFilterRequest} The TransferLogFilterRequest instance.
     */
    static of(filter: TransferLogFilter): TransferLogFilterRequest {
        return new TransferLogFilterRequest(
            filter.range != null
                ? FilterRangeRequest.of(filter.range)
                : undefined,
            filter.options != null
                ? new FilterOptionsRequest(
                      filter.options.limit ?? undefined,
                      filter.options.offset ?? undefined,
                      filter.options.includeIndexes ?? undefined
                  )
                : undefined,
            filter.criteriaSet != null
                ? filter.criteriaSet.map((criteria) =>
                      TransferCriteriaRequest.of(criteria)
                  )
                : undefined,
            filter.order ?? undefined
        );
    }

    /**
     * Converts the current TransferLogFilterRequestJSON instance into a JSON representation.
     *
     * @return {TransferLogFilterRequestJSON} The JSON object representing the current FilterOptions instance.
     */
    toJSON(): TransferLogFilterRequestJSON {
        return {
            range: this.range != null ? this.range.toJSON() : undefined,
            options: this.options != null ? this.options.toJSON() : undefined,
            criteriaSet:
                this.criteriaSet != null
                    ? this.criteriaSet.map((criteria) => criteria.toJSON())
                    : undefined,
            order: this.order ?? undefined
        } satisfies TransferLogFilterRequestJSON;
    }
}

export { TransferLogFilterRequest };
