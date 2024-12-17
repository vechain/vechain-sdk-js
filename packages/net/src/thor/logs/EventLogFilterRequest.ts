import { FilterRange, type FilterRangeJSON } from './FilterRange';
import { EventCriteria, type EventCriteriaJSON } from './EventCriteria';
import { FilterOptions, type FilterOptionsJSON } from './FilterOptions';

class EventLogFilterRequest {
    readonly range: FilterRange | null;
    readonly options: FilterOptions | null;
    readonly criteriaSet: EventCriteria[] | null;
    readonly order: EventLogFilterRequestOrder | null;

    constructor(json: EventLogFilterRequestJSON) {
        this.range = json.range === null ? null : new FilterRange(json.range);
        this.options =
            json.options === null ? null : new FilterOptions(json.options);
        this.criteriaSet =
            json.criteriaSet === null
                ? null
                : json.criteriaSet.map(
                      (criteriaJSON) => new EventCriteria(criteriaJSON)
                  );
        this.order =
            json.order === null
                ? null
                : (json.order as EventLogFilterRequestOrder);
    }

    toJSON(): EventLogFilterRequestJSON {
        return {
            range: this.range === null ? null : this.range.toJSON(),
            options: this.options === null ? null : this.options.toJSON(),
            criteriaSet:
                this.criteriaSet === null
                    ? null
                    : this.criteriaSet.map((criteria) => criteria.toJSON()),
            order: this.order === null ? null : this.order.toString()
        } satisfies EventLogFilterRequestJSON;
    }
}

interface EventLogFilterRequestJSON {
    range: FilterRangeJSON | null;
    options: FilterOptionsJSON | null;
    criteriaSet: EventCriteriaJSON[] | null;
    order: string | null;
}

enum EventLogFilterRequestOrder {
    asc = 'asc',
    desc = 'desc'
}

export {
    EventLogFilterRequest,
    type EventLogFilterRequestJSON,
    EventLogFilterRequestOrder
};
