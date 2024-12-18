import { FilterRange, type FilterRangeJSON } from './FilterRange';
import { FilterOptions, type FilterOptionsJSON } from './FilterOptions';
import { type LogSort } from './LogSort';
import {
    TransferCriteria,
    type TransferCriteriaJSON
} from './TransferCriteria';

class TransferLogFilterRequest {
    readonly range?: FilterRange;
    readonly options?: FilterOptions;
    readonly criteriaSet?: TransferCriteria[];
    readonly order?: LogSort;

    constructor(json: TransferLogFilterRequestJSON) {
        this.range =
            json.range === undefined ? undefined : new FilterRange(json.range);
        this.options =
            json.options === undefined
                ? undefined
                : new FilterOptions(json.options);
        this.criteriaSet = json.criteriaSet?.map(
            (criteriaJSON) => new TransferCriteria(criteriaJSON)
        );
        this.order =
            json.order === undefined
                ? undefined
                : (json.order satisfies LogSort);
    }

    toJSON(): TransferLogFilterRequestJSON {
        return {
            range: this.range?.toJSON(),
            options: this.options?.toJSON(),
            criteriaSet: this.criteriaSet?.map((criteria) => criteria.toJSON()),
            order: this.order
        } satisfies TransferLogFilterRequestJSON;
    }
}

interface TransferLogFilterRequestJSON {
    range?: FilterRangeJSON;
    options?: FilterOptionsJSON;
    criteriaSet?: TransferCriteriaJSON[];
    order?: LogSort;
}

export { TransferLogFilterRequest, type TransferLogFilterRequestJSON };
