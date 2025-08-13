import {
    EventCriteriaRequest,
    FilterOptionsRequest,
    FilterRangeRequest,
    type LogSort
} from '@thor';
import { type EventLogFilterRequestJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';
import { type EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/EventLogFilterRequest.ts!';

/**
 * [EventLogFilterRequest](EventLogFilterRequest)
 */
class EventLogFilterRequest {
    /**
     * Defines the range for filtering. Setting values to null indicates the entire range.
     */
    readonly range: FilterRangeRequest | null;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options: FilterOptionsRequest | null;

    /**
     * Criteria to filter events. All fields are joined with the AND operator.
     */
    readonly criteriaSet: EventCriteriaRequest[] | null;

    /**
     * Specifies the order of the results. Use `asc` for ascending order, and `desc` for descending order.S
     */
    readonly order: LogSort | null;

    /**
     * Constructs an instance of the class with the given filter criteria represented as a JSON object.
     *
     * @param {EventLogFilterRequestJSON} json - The JSON object containing filter criteria.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} Thrown when the provided JSON object contains invalid or unparsable data.
     */
    constructor(filter: EventLogFilter) {
        try {
            this.range =
                filter.range != null
                    ? new FilterRangeRequest(filter.range)
                    : null;
            this.options =
                filter.options != null
                    ? new FilterOptionsRequest(filter.options)
                    : null;
            this.criteriaSet =
                filter.criteriaSet?.map(
                    (criteria) => new EventCriteriaRequest(criteria)
                ) ?? null;
            this.order = filter.order;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(filter: EventLogFilter)`,
                'Unable to construct EventLogFilterRequest from EventLogFilter',
                { filter },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current EventLogFilterRequest instance into a JSON representation.
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
