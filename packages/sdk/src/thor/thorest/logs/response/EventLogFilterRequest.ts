import {
    FilterOptionsRequest,
    EventCriteriaRequest,
    FilterRangeRequest,
    type LogSortRequest
} from '@thor/thorest';
import { type EventLogFilterRequestJSON } from '@thor/thorest/json';
import { type EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';

/**
 * Full-Qualified-Path
 */

/**
 * Overall filter request for event logs.
 */
class EventLogFilterRequest {
    /**
     * The range for filtering
     */
    readonly range?: FilterRangeRequest;

    /**
     * The options for filtering.
     */
    readonly options?: FilterOptionsRequest;

    /**
     * Multiple criteria to filter events.
     */
    readonly criteriaSet?: EventCriteriaRequest[];

    /**
     * The order of the results.
     */
    readonly order?: LogSortRequest;

    /**
     * Constructs an instance of the class.
     *
     * @param {FilterRangeRequest} range - The range for filtering.
     * @param {FilterOptionsRequest} options - The options for filtering.
     * @param {EventCriteriaRequest[]} criteriaSet - The criteria to filter events.
     * @param {LogSort} order - The order of the results.
     */
    constructor(
        range?: FilterRangeRequest,
        options?: FilterOptionsRequest,
        criteriaSet?: EventCriteriaRequest[],
        order?: LogSortRequest
    ) {
        this.range = range;
        this.options = options;
        this.criteriaSet = criteriaSet;
        this.order = order;
    }

    /**
     * Constructs an instance of the class from an EventLogFilter.
     *
     * @param {EventLogFilter} filter - The EventLogFilter to convert to an EventLogFilterRequest.
     * @return {EventLogFilterRequest} The EventLogFilterRequest instance created from the EventLogFilter.
     */
    static of(filter: EventLogFilter): EventLogFilterRequest {
        return new EventLogFilterRequest(
            filter.range != null
                ? FilterRangeRequest.of(filter.range)
                : undefined,
            filter.options != null
                ? FilterOptionsRequest.of(filter.options)
                : undefined,
            filter.criteriaSet != null
                ? filter.criteriaSet.map((criteria) =>
                      EventCriteriaRequest.of(criteria)
                  )
                : undefined,
            filter.order != null
                ? (filter.order as unknown as LogSortRequest)
                : undefined
        );
    }

    /**
     * Converts the current EventLogFilterRequest instance into a JSON object.
     *
     * @return {EventLogFilterRequestJSON} The JSON object representing the current EventLogFilterRequest instance.
     */
    toJSON(): EventLogFilterRequestJSON {
        return {
            range: this.range?.toJSON(),
            options: this.options?.toJSON(),
            criteriaSet: this.criteriaSet?.map((criteria) => criteria.toJSON()),
            order: this.order?.toString()
        } satisfies EventLogFilterRequestJSON;
    }
}

export { EventLogFilterRequest };
