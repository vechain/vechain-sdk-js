import type {
    FilterOptionsJSON,
    FilterRangeJSON,
    TransferCriteriaJSON
} from '@thor';

interface TransferLogFilterRequestJSON {
    range?: FilterRangeJSON;
    options?: FilterOptionsJSON;
    criteriaSet?: TransferCriteriaJSON[];
    order?: string;
}

export { type TransferLogFilterRequestJSON };
