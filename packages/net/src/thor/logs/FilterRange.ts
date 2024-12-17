import { UInt } from '../../../../core/src';

class FilterRange {
    readonly unit: FilterRangeUnits | null;
    readonly from: UInt | null;
    readonly to: UInt | null;

    constructor(json: FilterRangeJSON) {
        this.unit = json.unit === null ? null : (json.unit as FilterRangeUnits);
        this.from = json.from === null ? null : UInt.of(json.from);
        this.to = json.to === null ? null : UInt.of(json.to);
    }

    toJSON(): FilterRangeJSON {
        return {
            unit: this.unit === null ? null : this.unit.toString(),
            from: this.from === null ? null : this.from.valueOf(),
            to: this.to === null ? null : this.to.valueOf()
        } satisfies FilterRangeJSON;
    }
}

interface FilterRangeJSON {
    unit: string | null;
    from: number | null;
    to: number | null;
}

enum FilterRangeUnits {
    block = 'block',
    time = 'time'
}

export { FilterRange, type FilterRangeJSON, FilterRangeUnits };
