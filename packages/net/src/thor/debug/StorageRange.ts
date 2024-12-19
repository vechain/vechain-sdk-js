import { ThorId } from '@vechain/sdk-core';

class StorageRange {
    readonly nextKey?: ThorId;
    readonly storage: undefined;

    constructor(json: StorageRangeJSON) {
        this.nextKey =
            json.nextKey === undefined ? undefined : ThorId.of(json.nextKey);
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
    storage: undefined;
}

export { StorageRange, type StorageRangeJSON };
