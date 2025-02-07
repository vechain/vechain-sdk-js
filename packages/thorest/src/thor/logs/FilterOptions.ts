import { UInt } from '@vechain/sdk-core';

class FilterOptions {
    /**
        Defaults to all results at the API level if not set
    **/
    readonly limit?: UInt;
    /**
        Defaults to 0 at the API level if not set
    **/
    readonly offset?: UInt;
    /**
        Defaults to false at the API level if not set
    **/
    readonly includeIndexes?: boolean;

    constructor(json: FilterOptionsJSON) {
        this.limit = json.limit === undefined ? undefined : UInt.of(json.limit);
        this.offset =
            json.offset === undefined ? undefined : UInt.of(json.offset);
        this.includeIndexes = json.includeIndexes;
    }

    toJSON(): FilterOptionsJSON {
        return {
            limit: this.limit?.valueOf(),
            offset: this.offset?.valueOf(),
            includeIndexes: this.includeIndexes
        } satisfies FilterOptionsJSON;
    }
}

interface FilterOptionsJSON {
    limit?: number;
    offset?: number;
    includeIndexes?: boolean;
}

export { FilterOptions, type FilterOptionsJSON };
