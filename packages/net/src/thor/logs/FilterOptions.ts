import { UInt } from '../../../../core/src';

class FilterOptions {
    readonly limit: UInt | null;
    readonly offset: UInt | null;

    constructor(json: FilterOptionsJSON) {
        this.limit = json.limit === null ? null : UInt.of(json.limit);
        this.offset = json.offset === null ? null : UInt.of(json.offset);
    }

    toJSON(): FilterOptionsJSON {
        return {
            limit: this.limit === null ? null : this.limit.valueOf(),
            offset: this.offset === null ? null : this.offset.valueOf()
        } satisfies FilterOptionsJSON;
    }
}

interface FilterOptionsJSON {
    limit: number | null;
    offset: number | null;
}

export { FilterOptions, type FilterOptionsJSON };
