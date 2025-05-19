import {
    type LogSort,
    FilterOptions,
    type FilterOptionsJSON,
    EventCriteria,
    type EventCriteriaJSON,
    FilterRange,
    type FilterRangeJSON
} from '@thor/logs';

class EventLogFilterRequest {
    readonly range?: FilterRange;
    readonly options?: FilterOptions;
    readonly criteriaSet?: EventCriteria[];
    readonly order?: LogSort;

    constructor(json: EventLogFilterRequestJSON) {
        this.range =
            json.range === undefined ? undefined : new FilterRange(json.range);
        this.options =
            json.options === undefined
                ? undefined
                : new FilterOptions(json.options);
        this.criteriaSet =
            json.criteriaSet === undefined
                ? undefined
                : json.criteriaSet.map(
                      (criteriaJSON) => new EventCriteria(criteriaJSON)
                  );
        this.order =
            json.order === undefined ? undefined : (json.order as LogSort);
    }

    toJSON(): EventLogFilterRequestJSON {
        return {
            range: this.range?.toJSON(),
            options: this.options?.toJSON(),
            criteriaSet: this.criteriaSet?.map((criteria) => criteria.toJSON()),
            order: this.order?.toString()
        } satisfies EventLogFilterRequestJSON;
    }
}

interface EventLogFilterRequestJSON {
    range?: FilterRangeJSON;
    options?: FilterOptionsJSON;
    criteriaSet?: EventCriteriaJSON[];
    order?: string;
}

export { EventLogFilterRequest, type EventLogFilterRequestJSON };
