import { UInt } from '@vechain/sdk-core';

class FilterRange {
    readonly unit?: FilterRangeUnits;
    readonly from?: UInt;
    readonly to?: UInt;

    constructor(json: FilterRangeJSON) {
        this.unit =
            typeof json.unit === 'string'
                ? (json.unit as FilterRangeUnits)
                : undefined;
        this.from =
            typeof json.from === 'number' ? UInt.of(json.from) : undefined;
        this.to = typeof json.to === 'number' ? UInt.of(json.to) : undefined;
    }

    toJSON(): FilterRangeJSON {
        return {
            unit: this.unit?.toString(),
            from: this.from?.valueOf(),
            to: this.to?.valueOf()
        } satisfies FilterRangeJSON;
    }
}

interface FilterRangeJSON {
    unit?: string;
    from?: number;
    to?: number;
}

enum FilterRangeUnits {
    block = 'block',
    time = 'time'
}

export { FilterRange, type FilterRangeJSON, FilterRangeUnits };
