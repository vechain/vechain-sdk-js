import {
    EventCriteria,
    type EventLogFilterRequestJSON,
    FilterOptions,
    FilterRange,
    LogSort
} from '@thor';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/logs/EventLogFilterRequest.ts!';

/**
 * [EventLogFilterRequest](EventLogFilterRequest)
 */
class EventLogFilterRequest {
    /**
     * Defines the range for filtering. Setting values to null indicates the entire range.
     */
    readonly range: FilterRange | null;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options: FilterOptions | null;

    /**
     * Criteria to filter events. All fields are joined with the AND operator.
     */
    readonly criteriaSet: EventCriteria[] | null;

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
    constructor(json: EventLogFilterRequestJSON) {
        try {
            this.range =
                json.range === undefined ? null : new FilterRange(json.range);
            this.options =
                json.options === undefined
                    ? null
                    : new FilterOptions(json.options);
            this.criteriaSet =
                json.criteriaSet === undefined
                    ? null
                    : json.criteriaSet.map(
                          (criteriaJSON) => new EventCriteria(criteriaJSON)
                      );
            this.order =
                json.order === undefined
                    ? null
                    : Object.values(LogSort).includes(json.order as LogSort)
                      ? (json.order as LogSort)
                      : null;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: EventLogFilterRequestJSON)`,
                'Bad parse',
                { json },
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
