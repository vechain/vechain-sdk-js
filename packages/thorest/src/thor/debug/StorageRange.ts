import { StorageKey } from '@vechain/sdk-core/src';

class StorageRange {
    readonly nextKey?: StorageKey;
    readonly storage: unknown;

    constructor(json: StorageRangeJSON) {
        this.nextKey =
            json.nextKey === undefined
                ? undefined
                : StorageKey.of(json.nextKey);
        this.storage = json.storage;
    }

    toJSON(): StorageRangeJSON {
        return {
            nextKey: this.nextKey?.toString(),
            storage: this.storage
        } satisfies StorageRangeJSON;
    }
}

interface StorageRangeJSON {
    nextKey?: string;
    storage: unknown;
}

export { StorageRange, type StorageRangeJSON };
