import { UInt } from '../../../../core/src';

class FilterOptions {
    readonly limit?: UInt;
    readonly offset?: UInt;

    constructor(json: FilterOptionsJSON) {
        this.limit = json.limit === undefined ? undefined : UInt.of(json.limit);
        this.offset =
            json.offset === undefined ? undefined : UInt.of(json.offset);
    }

    toJSON(): FilterOptionsJSON {
        return {
            limit: this.limit?.valueOf(),
            offset: this.offset?.valueOf()
        } satisfies FilterOptionsJSON;
    }
}

interface FilterOptionsJSON {
    limit?: number;
    offset?: number;
}

export { FilterOptions, type FilterOptionsJSON };
