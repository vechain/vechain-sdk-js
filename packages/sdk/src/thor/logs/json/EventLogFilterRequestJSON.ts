import type {
    EventCriteriaJSON,
    FilterOptionsJSON,
    FilterRangeJSON
} from '@thor/json';

/**
 * [EventLogFilterRequest](EventLogFilterRequest)
 */
interface EventLogFilterRequestJSON {
    range?: FilterRangeJSON;
    options?: FilterOptionsJSON;
    criteriaSet?: EventCriteriaJSON[];
    order?: string;
}

export { type EventLogFilterRequestJSON };
